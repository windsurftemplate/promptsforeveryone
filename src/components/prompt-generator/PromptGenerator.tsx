'use client'

import React, { useState, useEffect } from 'react'
import { Copy, Share2, Sparkles, RefreshCw, BookmarkPlus, Wand2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

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
        "can suddenly see everyone's memories",
        "receives letters from their future self",
        "inherits a library of impossible books",
        "discovers their dreams affect reality",
        "can travel through paintings",
        "finds a door that leads to any place they imagine"
      ]
    }
  },
  {
    text: "Create a dialogue between [character1] and [character2] about [topic]",
    category: "creative-writing",
    placeholders: {
      character1: [
        "a time traveler",
        "an AI",
        "a ghost",
        "a superhero",
        "a mythical creature",
        "an ancient deity",
        "a talking animal",
        "a space explorer",
        "a magical object",
        "a dream walker"
      ],
      character2: [
        "their past self",
        "a skeptical scientist",
        "a wise child",
        "a forgotten god",
        "a modern philosopher",
        "a celestial being",
        "a dimensional traveler",
        "a memory keeper",
        "an immortal being",
        "a reality bender"
      ],
      topic: [
        "the nature of consciousness",
        "the meaning of time",
        "the power of imagination",
        "the future of humanity",
        "the secrets of the universe",
        "the essence of reality",
        "the purpose of dreams",
        "the boundaries of existence",
        "the fabric of reality",
        "the mystery of existence"
      ]
    }
  },
  {
    text: "Explain [topic] to [audience] using [format]",
    category: "education",
    placeholders: {
      topic: [
        "quantum computing",
        "photosynthesis",
        "climate change",
        "blockchain",
        "artificial intelligence",
        "black holes",
        "DNA replication",
        "neural networks",
        "renewable energy",
        "space-time continuum",
        "quantum entanglement",
        "genetic engineering",
        "dark matter",
        "machine learning algorithms",
        "ecosystem balance"
      ],
      audience: [
        "a 10-year-old",
        "a high school student",
        "a complete beginner",
        "your grandmother",
        "an alien",
        "a medieval peasant",
        "a time traveler from the past",
        "a curious toddler",
        "a group of artists",
        "someone from the 1800s"
      ],
      format: [
        "simple analogies",
        "a story",
        "real-world examples",
        "a step-by-step guide",
        "a comic strip",
        "a cooking recipe",
        "a superhero origin story",
        "a fairy tale",
        "a video game tutorial",
        "a time travel adventure"
      ]
    }
  },
  {
    text: "Create a [timeframe] strategy to [business_objective] focusing on [aspect]",
    category: "business",
    placeholders: {
      timeframe: [
        "90-day",
        "6-month",
        "quarterly",
        "annual",
        "5-year",
        "immediate",
        "phased",
        "long-term",
        "adaptive",
        "scalable"
      ],
      business_objective: [
        "increase market share",
        "improve customer satisfaction",
        "optimize operations",
        "boost team productivity",
        "enhance brand awareness",
        "accelerate growth",
        "reduce operational costs",
        "expand globally",
        "transform digitally",
        "innovate products"
      ],
      aspect: [
        "customer experience",
        "employee engagement",
        "technological innovation",
        "sustainability",
        "market positioning",
        "competitive advantage",
        "operational efficiency",
        "brand loyalty",
        "digital presence",
        "team collaboration"
      ]
    }
  },
  {
    text: "Design a [duration] challenge to [goal] by implementing [strategy]",
    category: "personal-development",
    placeholders: {
      duration: [
        "30-day",
        "weekly",
        "3-month",
        "daily",
        "21-day",
        "quarterly",
        "year-long",
        "weekend",
        "morning",
        "evening"
      ],
      goal: [
        "build better habits",
        "increase productivity",
        "improve mindfulness",
        "enhance creativity",
        "boost energy levels",
        "develop leadership skills",
        "master time management",
        "strengthen relationships",
        "achieve work-life balance",
        "cultivate emotional intelligence"
      ],
      strategy: [
        "micro-habits",
        "accountability partnerships",
        "progress tracking",
        "reward systems",
        "reflection exercises",
        "skill stacking",
        "environmental design",
        "feedback loops",
        "visualization techniques",
        "habit bundling"
      ]
    }
  },
  {
    text: "Imagine [scenario] and describe [aspect] with [twist]",
    category: "fun",
    placeholders: {
      scenario: [
        "if books could feel emotions",
        "if music was visible",
        "if time ran backwards",
        "if shadows were colorful",
        "if dreams were tradeable",
        "if memories had flavors",
        "if emotions were weather",
        "if thoughts were audible",
        "if age was reversible",
        "if gravity was optional"
      ],
      aspect: [
        "daily interactions",
        "social media trends",
        "entertainment",
        "transportation",
        "communication",
        "fashion choices",
        "food preferences",
        "holiday celebrations",
        "sports events",
        "education system"
      ],
      twist: [
        "in a parallel universe",
        "during a cosmic event",
        "in an alternate timeline",
        "with magical consequences",
        "through a time traveler's eyes",
        "in a world without technology",
        "from an AI's perspective",
        "in a dimension of dreams",
        "with supernatural elements",
        "in a reality show format"
      ]
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
        "3D rendered",
        "concept art",
        "surrealist",
        "impressionist",
        "pixel art",
        "gothic",
        "art nouveau"
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
        "a peaceful garden",
        "a cosmic wanderer",
        "a time machine",
        "a dream catcher",
        "a crystal palace",
        "a mechanical beast",
        "an ethereal spirit"
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
        "during a magical storm",
        "between dimensions",
        "in a quantum realm",
        "through a time portal",
        "in a forgotten sanctuary",
        "above the clouds",
        "beneath an aurora"
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
        "magical",
        "surreal",
        "nostalgic",
        "futuristic",
        "otherworldly",
        "enchanted",
        "cosmic"
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

export default function PromptGenerator() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [enhancedTitle, setEnhancedTitle] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-xl font-semibold text-[#00ffff]">Please log in to use the Prompt Generator</h2>
        <Button onClick={() => router.push('/login')} className="bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]">
          Log In
        </Button>
      </div>
    );
  }

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
    if (!currentPrompt) return;
    
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/prompt-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: selectedCategory,
          instruction: `Enhance and improve the following prompt while maintaining its core purpose: ${currentPrompt}`,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt');
      }

      setEnhancedPrompt(data.prompt);
      setEnhancedTitle(data.title);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      // Handle error appropriately
    } finally {
      setIsEnhancing(false);
    }
  };

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

  const savePrompt = async (prompt: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/prompt-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: selectedCategory,
          prompt: prompt,
          title: enhancedTitle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      // Handle success
    } catch (error) {
      console.error('Error saving prompt:', error);
      // Handle error appropriately
    } finally {
      setIsSaving(false);
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
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              className="w-full text-white/90 text-lg mb-4 bg-black/50 border border-[#00ffff]/20 rounded-lg p-4 focus:border-[#00ffff]/40 focus:outline-none hover:border-[#00ffff]/40 transition-colors resize-none min-h-[100px]"
              placeholder="Enter or edit your prompt here..."
            />
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
                onClick={() => savePrompt(currentPrompt)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    Save
                  </>
                )}
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
                  <textarea
                    value={enhancedPrompt}
                    onChange={(e) => setEnhancedPrompt(e.target.value)}
                    className="w-full text-white/90 text-lg mb-4 bg-black/50 border border-[#00ffff]/20 rounded-lg p-4 focus:border-[#00ffff]/40 focus:outline-none hover:border-[#00ffff]/40 transition-colors resize-none min-h-[600px]"
                    placeholder="Edit the enhanced prompt here..."
                  />
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

                    <button
                      onClick={() => savePrompt(enhancedPrompt)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-4 h-4" />
                          Save
                        </>
                      )}
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