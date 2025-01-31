import { NextResponse } from 'next/server';
import { AI_CONFIG } from '@/config/ai';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const API_URL = 'https://api.together.xyz/inference';

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'Together API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();

    const analysisPrompt = `Analyze the following prompt and provide specific feedback on how to improve it. Focus on clarity, specificity, structure, and effectiveness. Here's the prompt to analyze:

"${prompt}"

Provide 3-5 specific suggestions for improvement, focusing on:
1. Clarity and specificity
2. Structure and organization
3. Context and requirements
4. Output format specification
5. Overall effectiveness

Format each suggestion as a clear, actionable item.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt: analysisPrompt,
        ...AI_CONFIG.settings
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze prompt');
    }

    const data = await response.json();
    const suggestions = data.output.choices[0].text
      .split('\n')
      .filter((line: string) => line.trim().length > 0 && line.match(/^[0-9]\.|\-/));

    return NextResponse.json({ feedback: suggestions });
  } catch (error) {
    console.error('Prompt analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze prompt' },
      { status: 500 }
    );
  }
} 