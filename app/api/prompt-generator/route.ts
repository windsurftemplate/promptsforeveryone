import { NextResponse } from 'next/server'
import { AI_CONFIG } from '@/config/ai';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const TOGETHER_API_URL = 'https://api.together.xyz/inference'

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured. Please contact support.' },
      { status: 500 }
    )
  }

  try {
    const { category, instruction } = await request.json()

    // Validate required parameters
    if (!category || !instruction) {
      return NextResponse.json(
        { error: 'Category and instruction are required.' },
        { status: 400 }
      )
    }

    // Call Together API to generate a prompt
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt: `You are a creative prompt generator. Generate a high-quality prompt for the following category: ${category}. Follow this instruction: ${instruction}. The prompt should be engaging, specific, and actionable. Format your response as a JSON object with "title" and "prompt" fields.`,
        ...AI_CONFIG.settings
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate prompt')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
} 