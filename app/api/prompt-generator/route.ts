import { NextResponse } from 'next/server'

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

    if (!category || !instruction) {
      return NextResponse.json(
        { error: 'Category and instruction are required' },
        { status: 400 }
      )
    }

    // First, generate the prompt
    const promptResponse = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `You are a creative prompt generator. Generate a high-quality prompt based on the following instruction:

${instruction}

The prompt should be engaging, specific, and actionable. Focus on creating a prompt that will inspire creative and meaningful responses.

Generate the prompt:`,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1.1,
        max_tokens: 200,
      }),
    })

    if (!promptResponse.ok) {
      throw new Error('Failed to generate prompt')
    }

    const promptData = await promptResponse.json()
    const generatedPrompt = promptData.output.choices[0].text.trim()

    // Then, generate a title for the prompt
    const titleResponse = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `You are a title generator. Create a concise, descriptive title for the following prompt:

${generatedPrompt}

The title should be brief (3-6 words) and capture the essence of the prompt. It should be engaging and help users quickly understand the prompt's purpose.

Generate only the title without any additional text or punctuation:`,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1.1,
        max_tokens: 50,
      }),
    })

    if (!titleResponse.ok) {
      throw new Error('Failed to generate title')
    }

    const titleData = await titleResponse.json()
    const generatedTitle = titleData.output.choices[0].text.trim()

    return NextResponse.json({ 
      prompt: generatedPrompt,
      title: generatedTitle
    })
  } catch (error) {
    console.error('Error in prompt generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
} 