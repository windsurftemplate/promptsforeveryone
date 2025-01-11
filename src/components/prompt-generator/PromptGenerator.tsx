'use client'

import React, { useState } from 'react'
import { Copy, Share2, Sparkles, RefreshCw, BookmarkPlus, Wand2, ArrowRight } from 'lucide-react'

type Category = 'all' | 'creative-writing' | 'business' | 'education' | 'personal-development' | 'fun' | 'image'

interface Prompt {
  text: string
  category: Category
  placeholders?: {
    [key: string]: string[]
  }
}

const PROMPTS: Prompt[] = [
  {
    text: "Write a story about a person who [scenario]",
    category: "creative-writing",
    placeholders: {
      scenario: [
        "wakes up with the ability to understand all languages",
        "discovers they can communicate with plants",
        "finds a mysterious package on their doorstep",
        "switches bodies with their pet",
        "can suddenly see everyone's memories"
      ]
    }
  },
  {
    text: "Explain [topic] to [audience] using [format]",
    category: "education",
    placeholders: {
      topic: ["quantum computing", "photosynthesis", "climate change", "blockchain", "artificial intelligence"],
      audience: ["a 10-year-old", "a high school student", "a complete beginner", "your grandmother", "an alien"],
      format: ["simple analogies", "a story", "real-world examples", "a step-by-step guide", "a comic strip"]
    }
  },
  {
    text: "Suggest [number] ways to [business_goal] for a [business_type]",
    category: "business",
    placeholders: {
      number: ["3", "5", "7", "10"],
      business_goal: ["increase customer retention", "improve online presence", "boost employee productivity", "reduce costs", "enhance customer experience"],
      business_type: ["small retail store", "tech startup", "restaurant", "online marketplace", "consulting firm"]
    }
  },
  {
    text: "Create a [duration] action plan to [personal_goal]",
    category: "personal-development",
    placeholders: {
      duration: ["30-day", "weekly", "3-month", "daily"],
      personal_goal: ["improve time management", "develop a new habit", "learn a new skill", "boost productivity", "reduce stress"]
    }
  },
  {
    text: "Imagine [fun_scenario] and describe [aspect]",
    category: "fun",
    placeholders: {
      fun_scenario: ["if animals could vote", "if food could talk", "if clouds had personalities", "if colors had flavors", "if dreams were shareable"],
      aspect: ["their daily routines", "their biggest complaints", "their favorite activities", "their social media posts", "their secret wishes"]
    }
  },
  {
    text: "Create a [style] image of [subject] in [setting] with [mood] atmosphere",
    category: "image",
    placeholders: {
      style: [
        "photorealistic",
        "digital art",
        "oil painting",
        "watercolor",
        "cyberpunk",
        "steampunk",
        "minimalist",
        "anime",
        "3D rendered"
      ],
      subject: [
        "a mystical forest guardian",
        "a futuristic cityscape",
        "a cozy cafe interior",
        "a majestic dragon",
        "an ancient temple",
        "a space explorer",
        "a magical library",
        "a steampunk inventor",
        "a peaceful garden"
      ],
      setting: [
        "during sunset",
        "in a misty morning",
        "under a starry night sky",
        "in a neon-lit street",
        "amidst floating islands",
        "in a crystal cave",
        "during a meteor shower",
        "in an underwater city",
        "during a magical storm"
      ],
      mood: [
        "dreamy",
        "mysterious",
        "peaceful",
        "energetic",
        "ethereal",
        "dramatic",
        "whimsical",
        "melancholic",
        "magical"
      ]
    }
  },
  {
    text: "Design a [composition] featuring [character] wearing [outfit] with [details]",
    category: "image",
    placeholders: {
      composition: [
        "portrait",
        "full-body shot",
        "dynamic action pose",
        "close-up",
        "environmental shot",
        "group composition",
        "silhouette",
        "isometric view",
        "bird's eye view"
      ],
      character: [
        "a cybernetic samurai",
        "an elven mage",
        "a desert nomad",
        "a time traveler",
        "a forest spirit",
        "a steam-powered robot",
        "a cosmic wanderer",
        "a mythical warrior",
        "a modern witch"
      ],
      outfit: [
        "ornate armor",
        "flowing robes",
        "high-tech battle suit",
        "vintage explorer gear",
        "magical ceremonial attire",
        "futuristic streetwear",
        "traditional cultural dress",
        "post-apocalyptic survival gear",
        "ethereal light garments"
      ],
      details: [
        "glowing magical runes",
        "floating geometric patterns",
        "mechanical augmentations",
        "nature-inspired ornaments",
        "holographic displays",
        "ancient symbols",
        "energy auras",
        "weather effects",
        "particle effects"
      ]
    }
  },
  {
    text: "Illustrate [scene] with [elements] in [art_style], emphasizing [focus]",
    category: "image",
    placeholders: {
      scene: [
        "a hidden sanctuary",
        "a bustling marketplace",
        "a forgotten laboratory",
        "a floating city",
        "an enchanted garden",
        "a cosmic observatory",
        "a secret underground base",
        "a dimensional portal",
        "a crystal palace"
      ],
      elements: [
        "floating lanterns",
        "ancient artifacts",
        "bioluminescent plants",
        "mechanical creatures",
        "magical portals",
        "time-worn architecture",
        "ethereal spirits",
        "advanced technology",
        "natural wonders"
      ],
      art_style: [
        "hyperrealistic",
        "impressionistic",
        "art nouveau",
        "gothic",
        "retro-futuristic",
        "biomechanical",
        "ethereal fantasy",
        "dark fantasy",
        "sci-fi minimalism"
      ],
      focus: [
        "dramatic lighting",
        "rich textures",
        "intricate details",
        "color harmony",
        "dynamic composition",
        "atmospheric effects",
        "contrast and shadows",
        "perspective and depth",
        "motion and energy"
      ]
    }
  }
]

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'image', name: 'Image Generation' },
  { id: 'creative-writing', name: 'Creative Writing' },
  { id: 'business', name: 'Business' },
  { id: 'education', name: 'Education' },
  { id: 'personal-development', name: 'Personal Development' },
  { id: 'fun', name: 'Fun & Entertainment' },
]

const PromptGenerator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [currentPrompt, setCurrentPrompt] = useState<string>('')
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [error, setError] = useState('')

  const replacePlaceholders = (prompt: Prompt): string => {
    let result = prompt.text
    
    if (prompt.placeholders) {
      Object.entries(prompt.placeholders).forEach(([key, values]) => {
        const randomValue = values[Math.floor(Math.random() * values.length)]
        result = result.replace(`[${key}]`, randomValue)
      })
    }
    
    return result
  }

  const generatePrompt = () => {
    const availablePrompts = PROMPTS.filter(p => 
      selectedCategory === 'all' || p.category === selectedCategory
    )
    
    if (availablePrompts.length === 0) return
    
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)]
    setCurrentPrompt(replacePlaceholders(randomPrompt))
  }

  const enhanceWithAI = async () => {
    if (!currentPrompt) return
    
    setIsEnhancing(true)
    setError('')
    setEnhancedPrompt('')

    try {
      const response = await fetch('/api/prompt-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          category: selectedCategory,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt')
      }

      setEnhancedPrompt(data.enhancedPrompt)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to enhance prompt'
      setError(message)
      console.error('Error:', err)
    } finally {
      setIsEnhancing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sharePrompt = async (text: string) => {
    try {
      await navigator.share({
        title: 'Check out this prompt!',
        text: text,
        url: window.location.href
      })
    } catch (err) {
      console.error('Failed to share:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as Category)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff]'
                : 'border-[#00ffff]/20 text-white/60 hover:border-[#00ffff]/40 hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePrompt}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
      >
        <Sparkles className="w-5 h-5" />
        Generate Random Prompt
      </button>

      {/* Generated Prompt Display */}
      {currentPrompt && (
        <div className="space-y-6">
          {/* Original Prompt */}
          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#00ffff]">Generated Prompt</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => generatePrompt()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={() => enhanceWithAI()}
                  disabled={isEnhancing}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-4 h-4" />
                  {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>
            </div>
            <p className="text-white/90 text-lg mb-4">{currentPrompt}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(currentPrompt)}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={() => sharePrompt(currentPrompt)}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <button
                onClick={() => {}} // TODO: Implement save functionality
                className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {/* Enhanced Prompt */}
          {(isEnhancing || enhancedPrompt || error) && (
            <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <h2 className="text-lg font-semibold text-[#00ffff] mb-4">AI-Enhanced Version</h2>
              {isEnhancing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
              ) : enhancedPrompt && (
                <>
                  <p className="text-white/90 text-lg mb-4">{enhancedPrompt}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyToClipboard(enhancedPrompt)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    
                    <button
                      onClick={() => sharePrompt(enhancedPrompt)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PromptGenerator 