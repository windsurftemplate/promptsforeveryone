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
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `You are a creative prompt generator. Generate a high-quality prompt for the following category: ${category}. Follow this instruction: ${instruction}. The prompt should be engaging, specific, and actionable. Format your response as a JSON object with "title" and "prompt" fields.`,
        temperature: 0.8,
        top_p: 0.9,
        top_k: 50,
        max_tokens: 200,
        repetition_penalty: 1.1
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.output.choices[0].text

    try {
      // Parse the generated text as JSON
      const parsedResponse = JSON.parse(generatedText)
      return NextResponse.json(parsedResponse)
    } catch (parseError) {
      // If parsing fails, try to extract title and prompt using regex
      const titleMatch = generatedText.match(/"title":\s*"([^"]+)"/)
      const promptMatch = generatedText.match(/"prompt":\s*"([^"]+)"/)

      if (titleMatch && promptMatch) {
        return NextResponse.json({
          title: titleMatch[1],
          prompt: promptMatch[1]
        })
      } else {
        // If regex fails, return the raw text as prompt
        return NextResponse.json({
          title: `${category} Prompt`,
          prompt: generatedText.trim()
        })
      }
    }
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt. Please try again.' },
      { status: 500 }
    )
  }
} 