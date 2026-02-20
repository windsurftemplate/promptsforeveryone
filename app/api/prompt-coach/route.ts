import { NextRequest, NextResponse } from 'next/server'
import { AI_CONFIG } from '@/config/ai';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const API_URL = 'https://api.together.xyz/v1/chat/completions'
const FREE_DAILY_LIMIT = 5

export async function POST(req: NextRequest) {
  try {
    if (!TOGETHER_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Check user subscription status
    const userRef = adminDb.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    const isPro = userData?.stripeSubscriptionStatus === 'active' || userData?.role === 'admin';

    // Check usage limits for free users
    if (!isPro) {
      const today = new Date().toISOString().split('T')[0];
      const usageRef = adminDb.ref(`users/${userId}/usage/coachToday`);
      const usageSnapshot = await usageRef.once('value');
      const usageData = usageSnapshot.val() || { count: 0, date: '' };

      // Reset if it's a new day
      if (usageData.date !== today) {
        await usageRef.set({ count: 0, date: today });
        usageData.count = 0;
      }

      // Check if limit reached
      if (usageData.count >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: 'Daily limit reached',
            limit: FREE_DAILY_LIMIT,
            upgradeUrl: '/price'
          },
          { status: 429 }
        );
      }

      // Increment usage count
      await usageRef.set({
        count: usageData.count + 1,
        date: today
      });
    }

    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided. Please provide a valid text prompt.' },
        { status: 400 }
      )
    }

    const requestBody = {
      model: AI_CONFIG.chatModel,
      messages: [
        {
          role: 'system',
          content: `You are a Prompt Engineering expert. Analyze prompts and provide detailed, constructive feedback to help users improve them. Focus on:
1. Clarity and specificity
2. Context and background information
3. Target audience definition
4. Action words and instructions
5. Format preferences
6. Edge cases and potential misinterpretations
7. Examples of improved versions

Keep your feedback constructive, specific, and actionable.`
        },
        {
          role: 'user',
          content: `Please analyze this prompt and provide detailed feedback: "${prompt}"`
        }
      ],
      temperature: AI_CONFIG.chatSettings.temperature,
      max_tokens: AI_CONFIG.chatSettings.max_tokens,
      top_p: AI_CONFIG.chatSettings.top_p
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('API Error Response:', JSON.stringify(errorData, null, 2))
      throw new Error(
        errorData?.error?.message || 
        `Failed to analyze prompt. Status: ${response.status}. Message: ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()
    console.log('API Response:', JSON.stringify(data, null, 2))
    
    // Check for both possible response formats
    const content = data.choices?.[0]?.message?.content || data.output?.choices?.[0]?.message?.content
    if (!content) {
      console.error('Invalid API Response Format:', JSON.stringify(data, null, 2))
      throw new Error('Invalid response format from AI service')
    }

    return NextResponse.json({ feedback: content })
  } catch (error) {
    console.error('Error analyzing prompt:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze prompt' },
      { status: 500 }
    );
  }
} 