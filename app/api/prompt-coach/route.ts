import { NextResponse } from 'next/server'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const API_URL = 'https://api.together.xyz/v1/chat/completions'

export async function POST(req: Request) {
  try {
    if (!TOGETHER_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please contact support.' },
        { status: 500 }
      )
    }

    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided. Please provide a valid text prompt.' },
        { status: 400 }
      )
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
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
        max_tokens: 1024,
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error?.message || response.statusText || 'Unknown error occurred'
      throw new Error(`API Error (${response.status}): ${errorMessage}`)
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in prompt-coach API:', error)
    
    // Determine if it's a known error type
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    
    // Map error messages to user-friendly responses
    const userFriendlyError = errorMessage.includes('API Error (429)') 
      ? 'Too many requests. Please try again in a moment.'
      : errorMessage.includes('API Error (401)') 
      ? 'Authentication error. Please contact support.'
      : errorMessage.includes('API Error (503)') 
      ? 'AI service is temporarily unavailable. Please try again later.'
      : errorMessage.includes('Invalid response format') 
      ? 'Received invalid response from AI service. Please try again.'
      : 'Failed to analyze prompt. Please try again later.'

    return NextResponse.json(
      { 
        error: userFriendlyError,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
} 