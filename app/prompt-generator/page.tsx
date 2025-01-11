import React from 'react'
import { Metadata } from 'next'
import PromptGenerator from '@/components/prompt-generator/PromptGenerator'

export const metadata: Metadata = {
  title: 'Random Prompt Generator - Get Creative Prompt Ideas',
  description: 'Generate creative and effective prompts for various use cases. Perfect for writing, education, business, and more.',
}

export default function PromptGeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-[#00ffff]">Random Prompt Generator</h1>
        <p className="mb-8 text-lg text-white/60">
          Discover creative prompt ideas for various use cases. Perfect for inspiration,
          learning, and exploring new ways to interact with AI.
        </p>
        <PromptGenerator />
      </div>
    </main>
  )
} 