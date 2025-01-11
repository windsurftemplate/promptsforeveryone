import React from 'react'
import { Metadata } from 'next'
import PromptCoach from '@/components/prompt-coach/PromptCoach'

export const metadata: Metadata = {
  title: 'Prompt Coach - Learn to Write Better Prompts',
  description: 'Interactive tool to help you write better, more effective prompts with real-time feedback and suggestions.',
}

export default function PromptCoachPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Prompt Coach</h1>
        <p className="mb-6 text-lg text-gray-600">
          Get real-time feedback and suggestions to improve your prompts. Learn best practices
          and create more effective prompts for better results.
        </p>
        <PromptCoach />
      </div>
    </main>
  )
} 