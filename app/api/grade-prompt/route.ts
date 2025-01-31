import { NextResponse } from 'next/server';
import { AI_CONFIG } from '@/config/ai';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const API_URL = 'https://api.together.xyz/v1/chat/completions';

function extractJSONFromText(text: string): Record<string, number> {
  try {
    // First try to find JSON between curly braces
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    // If no JSON found, try to parse scores from the text
    const scores: Record<string, number> = {};
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Look for patterns like "Criterion: 8" or "Criterion - 8"
      const match = line.match(/(["']?)(.+?)\1\s*[-:]\s*(\d+)/);
      if (match) {
        const [, , criterion, score] = match;
        scores[criterion.trim()] = parseInt(score, 10);
      }
    }

    if (Object.keys(scores).length > 0) {
      return scores;
    }

    throw new Error('No valid scoring data found in response');
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'Together API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt, challenge, criteria } = await request.json();

    const messages = [
      {
        role: 'system',
        content: 'You are an expert prompt engineer who grades prompts based on given criteria. You always respond with a JSON object containing scores for each criterion.'
      },
      {
        role: 'user',
        content: `Grade the following prompt improvement exercise:

Original (Weak) Prompt: "${challenge.weakPrompt}"

Student's Improved Prompt: "${prompt}"

Grade the improved prompt on these criteria (score out of 10 for each):
${criteria.map((criterion: string) => `- ${criterion}`).join('\n')}

Respond ONLY with a JSON object containing scores, like this:
{
  "${criteria[0]}": 8,
  "${criteria[1]}": 7
}`
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
      
      throw new Error('Failed to grade prompt');
    }

    const data = await response.json();
    const feedbackText = data.choices[0].message.content;
    
    // Parse the feedback using our robust extraction function
    const feedback = extractJSONFromText(feedbackText);

    // Calculate overall score (0-100)
    const totalScore = Object.values(feedback).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = Object.keys(feedback).length * 10;
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);

    return NextResponse.json({
      feedback,
      score: normalizedScore
    });
  } catch (error) {
    console.error('Prompt grading error:', error);
    return NextResponse.json(
      { error: 'Failed to grade prompt' },
      { status: 500 }
    );
  }
} 