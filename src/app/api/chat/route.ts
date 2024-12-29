import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const MODEL = 'meta-llama/Llama-Vision-Free';

export async function POST(req: Request) {
  try {
    // Enable CORS
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Check if Together API key is configured
    if (!TOGETHER_API_KEY) {
      console.error('TOGETHER_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Get the authorization token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the user's token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const uid = decodedToken.uid;

    // Check if user is pro
    const userSnapshot = await db.ref(`users/${uid}`).get();
    const userData = userSnapshot.val();
    
    if (!userData?.isPro && userData?.stripeSubscriptionStatus !== 'active') {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 });
    }

    // Get request body
    let message, history;
    try {
      const body = await req.json();
      message = body.message;
      history = body.history;
    } catch (error) {
      console.error('Request body parsing error:', error);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format conversation history for the API
    const formattedHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Add system message at the start
    formattedHistory.unshift({
      role: 'system',
      content: `You are an expert AI prompt engineer, specializing in helping users create effective prompts. Your role is to:
- Help users craft clear, specific, and well-structured prompts
- Suggest improvements to make prompts more effective
- Explain why certain prompt structures work better than others
- Provide examples of good prompts for different use cases
- Help users understand how to break down complex tasks into clear prompts
- Guide users in creating prompts that produce consistent and reliable results
- Suggest ways to make prompts more reusable and adaptable

When helping users, consider:
1. The specific goal or output they want to achieve
2. The context and constraints of their use case
3. The level of detail needed in the prompt
4. How to make the prompt clear and unambiguous
5. Ways to include relevant examples or context

Always aim to explain your suggestions and help users understand the principles of effective prompt engineering.`
    });

    // Add the new message
    formattedHistory.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to Together AI:', {
      model: MODEL,
      messages: formattedHistory
    });

    // Call Together AI API
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: formattedHistory,
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Together API response parsing error:', error);
      console.error('Raw response:', responseText);
      throw new Error('Invalid response from Together API');
    }

    if (!response.ok) {
      console.error('Together API Error:', data);
      throw new Error(data.message || 'API request failed');
    }

    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
} 