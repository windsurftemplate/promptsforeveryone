import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export const runtime = 'nodejs';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const MODEL = 'meta-llama/Llama-Vision-Free';

export async function POST(req: Request) {
  try {
    // Enable CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
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
      return Response.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Get the authorization token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the user's token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const uid = decodedToken.uid;

    // Check if user is pro
    const userSnapshot = await get(ref(db, `users/${uid}`));
    const userData = userSnapshot.val();
    
    const isUserPro = userData?.role === 'admin' || userData?.plan === 'paid';
    if (!isUserPro) {
      return Response.json({ error: 'Pro subscription required' }, { status: 403 });
    }

    // Get request body
    let message, history;
    try {
      const body = await req.json();
      message = body.message;
      history = body.history;
    } catch (error) {
      console.error('Request body parsing error:', error);
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format conversation history for the API
    const formattedHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Call Together API
    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          ...formattedHistory,
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['</s>', 'user:', 'assistant:']
      })
    });

    if (!response.ok) {
      console.error('Together API error:', await response.text());
      return Response.json(
        { error: 'Error generating response' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return Response.json({ response: result.output.choices[0].text });

  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 