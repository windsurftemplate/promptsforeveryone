'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronUpDownIcon, AcademicCapIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';

const learningPaths = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Learn the basics of prompt engineering',
    challenges: [
      {
        id: 'b1',
        title: 'Basic Context Setting',
        weakPrompt: 'Tell me about space.',
        hints: ['Add specific aspects to focus on', 'Specify the desired length', 'Include the target audience'],
        criteria: ['Context clarity', 'Specific focus', 'Clear objectives']
      },
      {
        id: 'b2',
        title: 'Simple Task Definition',
        weakPrompt: 'Write a story.',
        hints: ['Specify the genre', 'Define the length', 'Add character requirements'],
        criteria: ['Task clarity', 'Parameter definition', 'Output format']
      }
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Master advanced prompt structures and techniques',
    challenges: [
      {
        id: 'i1',
        title: 'Role-Based Prompting',
        weakPrompt: 'Help me with math.',
        hints: ['Define the expert role', 'Specify the math topic', 'Include difficulty level'],
        criteria: ['Role clarity', 'Topic specificity', 'Expertise level']
      },
      {
        id: 'i2',
        title: 'Chain-of-Thought',
        weakPrompt: 'Solve this problem.',
        hints: ['Break down the steps', 'Add reasoning requirements', 'Request explanations'],
        criteria: ['Step breakdown', 'Reasoning clarity', 'Process explanation']
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Expert-level prompt engineering techniques',
    challenges: [
      {
        id: 'a1',
        title: 'System Design Prompting',
        weakPrompt: 'Create an app.',
        hints: ['Define system requirements', 'Specify architecture needs', 'Include scalability considerations'],
        criteria: ['Requirement clarity', 'Architecture definition', 'Scalability planning']
      },
      {
        id: 'a2',
        title: 'Multi-Step Reasoning',
        weakPrompt: 'Analyze this data.',
        hints: ['Define analysis steps', 'Specify visualization needs', 'Include insight requirements'],
        criteria: ['Analysis structure', 'Visualization clarity', 'Insight depth']
      }
    ]
  }
];

export default function InteractiveLearning() {
  const [selectedPath, setSelectedPath] = useState(learningPaths[0]);
  const [currentChallenge, setCurrentChallenge] = useState(selectedPath.challenges[0]);
  const [userPrompt, setUserPrompt] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    setCurrentChallenge(selectedPath.challenges[0]);
    setUserPrompt('');
    setFeedback(null);
    setScore(null);
  }, [selectedPath]);

  const handlePathChange = (path: typeof learningPaths[0]) => {
    setSelectedPath(path);
  };

  const handleChallengeSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/grade-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userPrompt,
          challenge: currentChallenge,
          criteria: currentChallenge.criteria,
        }),
      });

      const data = await response.json();
      setFeedback(data.feedback);
      setScore(data.score);
    } catch (error) {
      console.error('Error grading prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#00ffff] mb-2">Interactive Learning Modes</h2>
        <p className="text-gray-400">Challenge yourself with hands-on prompt engineering exercises</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Learning Paths */}
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Learning Paths</h3>
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handlePathChange(path)}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedPath.id === path.id
                      ? 'border-[#00ffff] bg-[#00ffff]/10'
                      : 'border-[#00ffff]/20 hover:border-[#00ffff]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="h-5 w-5 text-[#00ffff]" />
                    <div className="text-left">
                      <div className="font-medium text-white">{path.name}</div>
                      <div className="text-sm text-gray-400 mt-1">{path.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Challenge Mode */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{currentChallenge.title}</h3>
              {score !== null && (
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">{score}/100</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="text-gray-400 mb-2">Weak Prompt:</div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-gray-300">
                {currentChallenge.weakPrompt}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Your Improved Prompt
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={6}
                className="w-full rounded-lg bg-black border border-[#00ffff]/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffff]/40"
                placeholder="Write your improved version here..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleChallengeSubmit}
                disabled={loading}
                className="flex-1 bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-medium py-3"
              >
                {loading ? 'Grading...' : 'Submit for Grading'}
              </Button>
              <Button
                onClick={() => setShowHints(!showHints)}
                className="bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-medium px-4"
              >
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </Button>
            </div>

            {showHints && (
              <div className="mt-6 space-y-3">
                <div className="text-gray-300 font-medium">Hints:</div>
                {currentChallenge.hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-3 text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-[#00ffff] shrink-0 mt-0.5" />
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {feedback && (
            <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">AI Feedback</h3>
              <div className="space-y-4">
                {Object.entries(feedback).map(([criterion, score]: [string, any]) => (
                  <div key={criterion} className="border-b border-[#00ffff]/10 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">{criterion}</span>
                      <span className="text-[#00ffff] font-medium">{score}/10</span>
                    </div>
                    <div className="w-full bg-[#00ffff]/10 rounded-full h-2">
                      <div
                        className="bg-[#00ffff] h-2 rounded-full transition-all"
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 