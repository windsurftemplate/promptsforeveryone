'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, Wand2, BookmarkPlus } from 'lucide-react'
import { ref, push } from 'firebase/database'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface FeedbackItem {
  category: string
  passed: boolean
  message: string
}

interface PromptAnalysis {
  score: number
  totalChecks: number
  feedback: FeedbackItem[]
}

interface APIError {
  error: string
  details?: string
}

const PromptCoach: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('')
  const [analysis, setAnalysis] = useState<PromptAnalysis>({
    score: 0,
    totalChecks: 5,
    feedback: []
  })
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [editedAIAnalysis, setEditedAIAnalysis] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-xl font-semibold text-[#00ffff]">Please log in to use the Prompt Coach</h2>
        <Button onClick={() => router.push('/login')} className="bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]">
          Log In
        </Button>
      </div>
    );
  }

  const analyzePrompt = (text: string): PromptAnalysis => {
    const feedback: FeedbackItem[] = []
    let score = 0

    // Check for clarity
    if (text.length > 20 && text.includes(' ')) {
      feedback.push({
        category: 'Clarity',
        passed: true,
        message: 'Your prompt is clear and well-structured.'
      })
      score++
    } else {
      feedback.push({
        category: 'Clarity',
        passed: false,
        message: 'Your prompt could be clearer. Try to be more specific about what you want.'
      })
    }

    // Check for context
    if (text.includes('for') || text.includes('because') || text.includes('context')) {
      feedback.push({
        category: 'Context',
        passed: true,
        message: 'Good job providing context!'
      })
      score++
    } else {
      feedback.push({
        category: 'Context',
        passed: false,
        message: 'Consider adding more context or background information.'
      })
    }

    // Check for target audience
    if (text.toLowerCase().includes('for a') || text.toLowerCase().includes('to a')) {
      feedback.push({
        category: 'Target Audience',
        passed: true,
        message: 'Great job specifying your target audience!'
      })
      score++
    } else {
      feedback.push({
        category: 'Target Audience',
        passed: false,
        message: 'Consider specifying who this is for (e.g., "for a beginner").'
      })
    }

    // Check for specific instructions
    const actionWords = ['explain', 'describe', 'list', 'compare', 'analyze', 'summarize']
    if (actionWords.some(word => text.toLowerCase().includes(word))) {
      feedback.push({
        category: 'Specific Instructions',
        passed: true,
        message: 'Good use of action words!'
      })
      score++
    } else {
      feedback.push({
        category: 'Specific Instructions',
        passed: false,
        message: 'Add clear action words like "explain," "describe," or "compare."'
      })
    }

    // Check for length/format preferences
    if (text.includes('words') || text.includes('paragraphs') || text.includes('bullet points')) {
      feedback.push({
        category: 'Format Preferences',
        passed: true,
        message: 'Excellent job specifying format preferences!'
      })
      score++
    } else {
      feedback.push({
        category: 'Format Preferences',
        passed: false,
        message: 'Consider specifying your preferred format or length.'
      })
    }

    return {
      score,
      totalChecks: 5,
      feedback
    }
  }

  const getAIAnalysis = async (text: string) => {
    if (!text.trim()) {
      setError('Please enter a prompt first')
      return
    }

    setIsLoading(true)
    setError('')
    setAiAnalysis('')

    try {
      const response = await fetch('/api/prompt-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as APIError
        throw new Error(errorData.error)
      }

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Received invalid response from AI service')
      }

      setAiAnalysis(data.choices[0].message.content)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Error in AI analysis:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const result = analyzePrompt(prompt)
    setAnalysis(result)
  }, [prompt])

  useEffect(() => {
    if (aiAnalysis) {
      setEditedAIAnalysis(aiAnalysis)
    }
  }, [aiAnalysis])

  const savePrompt = async () => {
    if (!prompt || !editedAIAnalysis) return
    
    setIsSaving(true)
    try {
      const timestamp = new Date().toISOString()
      const promptData = {
        title: 'AI Coached Prompt',
        content: prompt,
        analysis: editedAIAnalysis,
        categoryId: 'prompt-coach',
        userId: 'admin',
        userName: 'Admin',
        visibility: 'public',
        createdAt: timestamp,
        updatedAt: timestamp
      }

      // Save to prompts collection
      const promptsRef = ref(db, 'prompts')
      await push(promptsRef, promptData)

      setSuccessMessage('Prompt saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error saving prompt:', err)
      setError('Failed to save prompt. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/30 transition-all duration-300">
        <label htmlFor="prompt" className="block text-sm font-medium text-[#00ffff] mb-2">
          Enter your prompt
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full bg-black/50 text-white border border-[#00ffff]/20 rounded-lg p-4 focus:border-[#00ffff]/40 focus:outline-none hover:border-[#00ffff]/40 transition-colors resize-none mb-4"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={() => getAIAnalysis(prompt)}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 disabled:opacity-50 disabled:cursor-not-allowed text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
        >
          <Wand2 className="w-4 h-4" />
          {isLoading ? 'Analyzing...' : 'Analyze with AI'}
        </button>
      </div>

      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Prompt Analysis</h2>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-medium text-white/80">Score:</span>
            <span className="text-lg font-bold text-[#00ffff]">{analysis.score}/{analysis.totalChecks}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-black/50">
            <div
              className="h-2 rounded-full bg-[#00ffff]"
              style={{ width: `${(analysis.score / analysis.totalChecks) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {analysis.feedback.map((item, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg bg-black/50 p-4 border border-[#00ffff]/10">
              {item.passed ? (
                <CheckCircle className="h-5 w-5 text-[#00ffff] shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
              <div>
                <h3 className="font-medium text-[#00ffff]">{item.category}</h3>
                <p className="text-sm text-white/60">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#00ffff]">AI Feedback</h2>
          {aiAnalysis && !isLoading && !error && (
            <button
              onClick={savePrompt}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  Save Prompt
                </>
              )}
            </button>
          )}
        </div>
        <div className="rounded-lg bg-black/50 p-4 border border-[#00ffff]/10 min-h-[100px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-[#00ffff] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col gap-2">
              <p className="text-red-500 text-sm font-medium">{error}</p>
              <button
                onClick={() => getAIAnalysis(prompt)}
                className="self-start text-sm text-[#00ffff]/80 hover:text-[#00ffff] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : aiAnalysis ? (
            <div className="prose prose-invert max-w-none">
              <textarea
                value={editedAIAnalysis}
                onChange={(e) => setEditedAIAnalysis(e.target.value)}
                className="w-full bg-transparent text-white/80 text-sm whitespace-pre-wrap focus:outline-none min-h-[200px] resize-none"
                placeholder="AI feedback will appear here..."
              />
            </div>
          ) : (
            <p className="text-white/60 text-sm">Click the Analyze button to get AI feedback on your prompt...</p>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          {successMessage}
        </div>
      )}
    </div>
  )
}

export default PromptCoach 