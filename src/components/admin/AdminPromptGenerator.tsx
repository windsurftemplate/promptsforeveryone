'use client'

import React, { useState, useEffect } from 'react'
import { Copy, Share2, Sparkles, RefreshCw, BookmarkPlus, Wand2, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ref, onValue, push, update, increment } from 'firebase/database'
import { db } from '@/lib/firebase'

interface Category {
  id: string
  name: string
  count: number
  subcategories?: {
    [key: string]: {
      name: string
    }
  }
}

interface Prompt {
  text: string
  category: string
  subcategory?: string
}

interface SavedPrompt {
  id?: string
  text: string
  title: string
  category: string
  subcategory?: string
  createdAt: number
}

export default function AdminPromptGenerator() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [showSubcategories, setShowSubcategories] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string>('')
  const [currentTitle, setCurrentTitle] = useState<string>('')
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('')
  const [enhancedTitle, setEnhancedTitle] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')

  useEffect(() => {
    // Reset subcategory when category changes
    setSelectedSubcategory('')
    setShowSubcategories(false)
  }, [selectedCategory])

  useEffect(() => {
    // Fetch categories from Firebase
    const categoriesRef = ref(db, 'categories')
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          ...category,
        }))
        setCategories(categoriesArray)
      }
    })

    return () => unsubscribe()
  }, [])

  const getCurrentCategory = () => {
    return categories.find(c => c.id === selectedCategory)
  }

  const getSubcategories = () => {
    const category = getCurrentCategory()
    if (!category?.subcategories) return []
    return Object.entries(category.subcategories).map(([id, sub]) => ({
      id,
      name: sub.name
    }))
  }

  const getCategoryPrompt = (categoryId: string, subcategoryId?: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return 'Generate a versatile and engaging prompt that can be used for any purpose.'
    
    if (subcategoryId && category.subcategories?.[subcategoryId]) {
      return `Generate a ${category.subcategories[subcategoryId].name.toLowerCase()}-focused prompt within the ${category.name.toLowerCase()} category that is specific, engaging, and actionable.`
    }
    
    return `Generate a ${category.name.toLowerCase()}-focused prompt that is specific, engaging, and actionable.`
  }

  const generatePrompt = async () => {
    setIsGenerating(true)
    setError('')
    
    try {
      const response = await fetch('/api/prompt-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          subcategory: selectedSubcategory,
          instruction: getCategoryPrompt(selectedCategory, selectedSubcategory),
          generateTitle: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate prompt')
      }

      const data = await response.json()
      setCurrentPrompt(data.prompt)
      setCurrentTitle(data.title || 'Untitled Prompt')
      setEnhancedPrompt('')
      setEnhancedTitle('')
    } catch (err) {
      console.error('Error generating prompt:', err)
      setError('Failed to generate prompt. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const enhanceWithAI = async () => {
    if (!currentPrompt) return

    setIsEnhancing(true)
    setError('')

    try {
      const response = await fetch('/api/prompt-generator/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          title: currentTitle,
          category: selectedCategory,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance prompt')
      }

      const data = await response.json()
      setEnhancedPrompt(data.enhancedPrompt)
      setEnhancedTitle(data.enhancedTitle || `Enhanced: ${currentTitle}`)
    } catch (err) {
      console.error('Error enhancing prompt:', err)
      setError('Failed to enhance prompt. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sharePrompt = (text: string) => {
    // TODO: Implement sharing functionality
    console.log('Sharing:', text)
  }

  const savePrompt = async (text: string, title: string) => {
    if (!selectedCategory || selectedCategory === 'all') {
      setError('Please select a category before saving')
      return
    }

    setIsSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const timestamp = new Date().toISOString()
      const promptData = {
        title,
        content: text,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory || null,
        userId: 'admin',
        userName: 'Admin',
        visibility: 'public',
        createdAt: timestamp,
        updatedAt: timestamp
      }

      // Save to prompts collection
      const promptsRef = ref(db, 'prompts')
      const newPromptRef = await push(promptsRef, promptData)

      // If there's a subcategory, save to user's subcategories
      if (selectedSubcategory) {
        const subcategoryRef = ref(db, `categories/${selectedCategory}/subcategories/${selectedSubcategory}`)
        await update(subcategoryRef, {
          count: increment(1)
        })
      }

      // Show success message
      const category = categories.find(c => c.id === selectedCategory)
      const subcategory = selectedSubcategory ? category?.subcategories?.[selectedSubcategory] : null
      const locationText = subcategory 
        ? `${category?.name} > ${subcategory.name}`
        : category?.name || selectedCategory

      setSuccessMessage(`Prompt saved successfully to ${locationText}!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error saving prompt:', err)
      setError('Failed to save prompt. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex items-center justify-between pb-6 border-b border-[#00ffff]/20">
        <div>
          <h1 className="text-2xl font-bold text-white">Prompt Generator</h1>
          <p className="text-[#00ffff]/60">Generate and manage AI prompts across different categories</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-6">
        {/* Category and Subcategory Selection */}
        <div className="w-80 flex-shrink-0">
          <div className="flex flex-col gap-4">
            <button
              key="all"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 text-left ${
                selectedCategory === 'all'
                  ? 'bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff]'
                  : 'border-[#00ffff]/20 text-white/60 hover:border-[#00ffff]/40 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 text-left ${
                    selectedCategory === category.id
                      ? 'bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff]'
                      : 'border-[#00ffff]/20 text-white/60 hover:border-[#00ffff]/40 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
                {selectedCategory === category.id && category.subcategories && (
                  <div className="ml-4 pl-4 border-l border-[#00ffff]/20">
                    {Object.entries(category.subcategories).map(([subId, sub]) => (
                      <button
                        key={subId}
                        onClick={() => setSelectedSubcategory(subId)}
                        className={`w-full px-4 py-2 mb-2 rounded-lg border transition-all duration-300 text-left ${
                          selectedSubcategory === subId
                            ? 'bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff]'
                            : 'border-[#00ffff]/20 text-white/40 hover:border-[#00ffff]/40 hover:text-white'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Generate Button */}
          <button
            onClick={generatePrompt}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Random Prompt
              </>
            )}
          </button>

          {/* Generated Prompt Display */}
          {currentPrompt && (
            <div className="space-y-6">
              {/* Title Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00ffff]">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Prompt Title</h2>
                </div>
                <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-4">
                  <p className="text-lg text-white font-medium">{currentTitle}</p>
                </div>
              </div>

              {/* Prompt Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00ffff]">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Prompt Content</h2>
                </div>
                <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-lg text-white">{currentPrompt}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${currentTitle}\n\n${currentPrompt}`)}
                        className="text-[#00ffff] hover:text-[#00ffff]/80"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sharePrompt(`${currentTitle}\n\n${currentPrompt}`)}
                        className="text-[#00ffff] hover:text-[#00ffff]/80"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => savePrompt(currentPrompt, currentTitle)}
                        disabled={isSaving}
                        className="text-[#00ffff] hover:text-[#00ffff]/80"
                      >
                        {isSaving ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Enhancement Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={enhanceWithAI}
                    disabled={isEnhancing}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg border border-[#00ffff]/20 transition-all duration-300 hover:border-[#00ffff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnhancing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>

                {enhancedPrompt && (
                  <div className="space-y-4">
                    {/* Enhanced Title Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-[#00ffff]">
                        <Wand2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Enhanced Title</span>
                      </div>
                      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-4">
                        <p className="text-lg text-white font-medium">{enhancedTitle}</p>
                      </div>
                    </div>

                    {/* Enhanced Prompt Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-[#00ffff]">
                        <Wand2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Enhanced Content</span>
                      </div>
                      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-lg text-white">{enhancedPrompt}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${enhancedTitle}\n\n${enhancedPrompt}`)}
                              className="text-[#00ffff] hover:text-[#00ffff]/80"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sharePrompt(`${enhancedTitle}\n\n${enhancedPrompt}`)}
                              className="text-[#00ffff] hover:text-[#00ffff]/80"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => savePrompt(enhancedPrompt, enhancedTitle)}
                              disabled={isSaving}
                              className="text-[#00ffff] hover:text-[#00ffff]/80"
                            >
                              {isSaving ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <BookmarkPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          {successMessage}
        </div>
      )}

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  )
} 