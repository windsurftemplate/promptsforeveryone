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
    const { prompt, title, category } = await request.json()

    if (!prompt || typeof prompt !== 'string' || !title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt or title provided.' },
        { status: 400 }
      )
    }

    // First, enhance the prompt
    const promptResponse = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt: `You are a creative prompt enhancement expert. Your task is to take a basic prompt and enhance it by:
1. Adding more specific details and context
2. Making it more engaging and creative
3. Ensuring it's well-structured and clear
4. Adapting it to the specified category: ${category || 'general'}

Keep the enhanced version concise but more effective than the original.
Respond with ONLY the enhanced prompt, no explanations or additional text.

Enhance this prompt: "${prompt}"`,
        ...AI_CONFIG.settings
      }),
    })

    if (!promptResponse.ok) {
      throw new Error('Failed to enhance prompt')
    }

    const promptData = await promptResponse.json()
    const enhancedPrompt = promptData.output.choices[0].text.trim()

    // Then, enhance the title
    const titleResponse = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt: `You are a title enhancement expert. Your task is to take a basic title and enhance it to be more engaging and descriptive.

Original Title: "${title}"
Enhanced Prompt: "${enhancedPrompt}"

Create an enhanced version of the title that:
1. Better reflects the enhanced prompt
2. Is more engaging and specific
3. Remains concise (3-6 words)
4. Captures attention immediately

Generate only the enhanced title without any additional text or punctuation:`,
        ...AI_CONFIG.settings
      }),
    })

    if (!titleResponse.ok) {
      throw new Error('Failed to enhance title')
    }

    const titleData = await titleResponse.json()
    const enhancedTitle = titleData.output.choices[0].text.trim()

    return NextResponse.json({
      title: enhancedTitle,
      prompt: enhancedPrompt
    })
  } catch (error) {
    console.error('Error enhancing prompt:', error)
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    )
  }
} 