import { NextResponse } from 'next/server';
import { AI_CONFIG } from '@/config/ai';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const API_URL = 'https://api.together.xyz/v1/chat/completions';

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'Together API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { type, purpose, tone, length, additionalInfo } = await request.json();

    const messages = [
      {
        role: 'system',
        content: 'You are an expert content creator who specializes in generating high-quality templates and content. You provide clear, well-structured, and professional output that matches the specified requirements.'
      },
      {
        role: 'user',
        content: `Generate a ${type} with the following specifications:
Purpose: ${purpose}
Tone: ${tone}
Length: ${length}
Additional Information: ${additionalInfo}

Please provide a well-structured and professional ${type} that matches these requirements.`
      }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.chatModel,
        messages,
        temperature: AI_CONFIG.chatSettings.temperature,
        max_tokens: AI_CONFIG.chatSettings.max_tokens,
        top_p: AI_CONFIG.chatSettings.top_p
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      
      // Check for rate limit error
      if (errorData?.error?.type === 'model_rate_limit') {
        return NextResponse.json(
          { error: 'Service is temporarily busy. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      throw new Error('Failed to generate template');
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error('Template generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate template' },
      { status: 500 }
    );
  }
} 