'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, Wand2, BookmarkPlus, RefreshCw } from 'lucide-react'
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
        <h2 className="text-xl font-semibold text-[#8B5CF6]">Please log in to use the Prompt Coach</h2>
        <Button onClick={() => router.push('/login')} className="bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6]">
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

      if (!data.feedback) {
        throw new Error('Received invalid response from AI service')
      }

      setAiAnalysis(data.feedback)
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
    <div className="space-y-8 w-1/2 mx-auto relative">
      {/* Quick Analysis - Positioned absolutely to the left */}
      <div className="absolute right-full top-0 pr-6 w-80">
        <div className="space-y-3 sticky top-6">
          {analysis.feedback.map((item) => (
            <div
              key={item.category}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                item.passed
                  ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              {item.passed ? (
                <CheckCircle className="w-5 h-5 text-[#8B5CF6] shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
              <div>
                <h3 className={`font-medium mb-1 ${item.passed ? 'text-[#8B5CF6]' : 'text-red-500'}`}>
                  {item.category}
                </h3>
                <p className="text-sm text-white/70">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 hover:border-[#8B5CF6]/30 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#8B5CF6]">Your Prompt</h2>
          <Button
            onClick={() => getAIAnalysis(prompt)}
            disabled={isLoading || !prompt.trim()}
            className="bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Get AI Analysis
              </>
            )}
          </Button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full min-h-[200px] text-white/90 text-lg bg-black/50 border border-[#8B5CF6]/20 rounded-lg p-4 focus:border-[#8B5CF6]/40 focus:outline-none hover:border-[#8B5CF6]/40 transition-colors resize-none"
          placeholder="Enter your prompt here..."
        />
      </div>

      {/* AI Analysis Section */}
      {(isLoading || aiAnalysis || error) && (
        <div className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 hover:border-[#8B5CF6]/30 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#8B5CF6]">AI Analysis & Suggestions</h2>
            {aiAnalysis && (
              <Button
                onClick={savePrompt}
                disabled={isSaving}
                className="bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    Save Analysis
                  </>
                )}
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          ) : aiAnalysis && (
            <div className="space-y-4">
              <textarea
                value={editedAIAnalysis}
                onChange={(e) => setEditedAIAnalysis(e.target.value)}
                className="w-full min-h-[800px] text-white/90 text-lg bg-black/50 border border-[#8B5CF6]/20 rounded-lg p-4 focus:border-[#8B5CF6]/40 focus:outline-none hover:border-[#8B5CF6]/40 transition-colors resize-none"
                placeholder="AI analysis will appear here..."
              />
              {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                  {successMessage}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PromptCoach 