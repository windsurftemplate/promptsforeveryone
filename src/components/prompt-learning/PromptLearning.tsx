'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const promptTemplates = [
  {
    id: 'context-task-example',
    name: 'Context-Task-Example',
    description: 'Provide context, specify the task, and give an example',
    structure: 'Context: [Background Information]\nTask: [What you want]\nExample: [Sample output]'
  },
  {
    id: 'role-goal-context',
    name: 'Role-Goal-Context',
    description: 'Define role, set goal, provide context',
    structure: 'Role: [Expert type]\nGoal: [Desired outcome]\nContext: [Situation details]'
  },
  {
    id: 'situation-task-response',
    name: 'Situation-Task-Response',
    description: 'Describe situation, specify task, request response format',
    structure: 'Situation: [Current scenario]\nTask: [Required action]\nResponse Format: [Output structure]'
  },
  {
    id: 'step-by-step',
    name: 'Step-by-Step',
    description: 'Break down complex requests into steps',
    structure: '1. First, [initial step]\n2. Then, [next step]\n3. Finally, [final step]\nOutput Format: [Desired format]'
  }
];

const commonMistakes = [
  { mistake: 'Being too vague', fix: 'Add specific details and requirements' },
  { mistake: 'Missing context', fix: 'Include relevant background information' },
  { mistake: 'Unclear objectives', fix: 'State your desired outcome explicitly' },
  { mistake: 'No format specification', fix: 'Define how you want the response structured' }
];

export default function PromptLearning() {
  const [userPrompt, setUserPrompt] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(promptTemplates[0]);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const analyzePrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error analyzing prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (template: typeof promptTemplates[0]) => {
    setSelectedTemplate(template);
    setUserPrompt(template.structure);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#00ffff] mb-2">Learn Prompting Effectively</h2>
        <p className="text-gray-400">Master the art of crafting effective prompts with our interactive tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Prompt Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Interactive Prompt Builder</h3>
            
            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Choose a Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promptTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-[#00ffff] bg-[#00ffff]/10'
                        : 'border-[#00ffff]/20 hover:border-[#00ffff]/40'
                    }`}
                  >
                    <div className="font-medium text-white">{template.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Your Prompt
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={8}
                className="w-full rounded-lg bg-black border border-[#00ffff]/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffff]/40"
                placeholder="Write your prompt here..."
              />
            </div>

            <Button
              onClick={analyzePrompt}
              disabled={loading}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-medium py-3"
            >
              {loading ? 'Analyzing...' : 'Analyze Prompt'}
            </Button>
          </div>

          {/* Feedback Section */}
          {feedback.length > 0 && (
            <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">AI Feedback</h3>
              <div className="space-y-4">
                {feedback.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Learning Resources */}
        <div className="lg:col-span-1 space-y-6">
          {/* Common Mistakes */}
          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Common Mistakes to Avoid</h3>
            <div className="space-y-4">
              {commonMistakes.map((item, index) => (
                <div key={index} className="border-b border-[#00ffff]/10 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <XMarkIcon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-red-400 font-medium">{item.mistake}</div>
                      <div className="text-sm text-gray-400 mt-1">{item.fix}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Example Comparison */}
          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Example Comparison</h3>
            <Button
              onClick={() => setShowComparison(!showComparison)}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-medium"
            >
              {showComparison ? 'Hide Examples' : 'Show Examples'}
            </Button>
            
            {showComparison && (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-red-500/20 p-4">
                  <div className="text-red-400 font-medium mb-2">Weak Prompt</div>
                  <div className="text-gray-400 text-sm">
                    "Write something about AI"
                  </div>
                </div>
                <div className="rounded-lg border border-green-500/20 p-4">
                  <div className="text-green-400 font-medium mb-2">Strong Prompt</div>
                  <div className="text-gray-400 text-sm">
                    "Write a 500-word article about the impact of AI on healthcare, focusing on recent breakthroughs in diagnostic imaging. Include 3 specific examples and their potential benefits for patients."
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 