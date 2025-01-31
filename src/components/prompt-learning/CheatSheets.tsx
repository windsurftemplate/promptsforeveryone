'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, BookOpenIcon, LightBulbIcon, BeakerIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const cheatSheets = [
  {
    id: 'basics',
    name: 'Prompt Engineering Basics',
    icon: BookOpenIcon,
    sections: [
      {
        title: 'Core Components',
        items: [
          { label: 'Context', description: 'Background information and setting' },
          { label: 'Instruction', description: 'Clear, specific task or request' },
          { label: 'Examples', description: 'Sample inputs and outputs' },
          { label: 'Format', description: 'Desired output structure' }
        ]
      },
      {
        title: 'Best Practices',
        items: [
          { label: 'Be Specific', description: 'Avoid vague or ambiguous language' },
          { label: 'Set Boundaries', description: 'Define scope and limitations' },
          { label: 'Use Examples', description: 'Demonstrate desired outcomes' },
          { label: 'Iterate', description: 'Refine prompts based on results' }
        ]
      }
    ]
  },
  {
    id: 'techniques',
    name: 'Advanced Techniques',
    icon: LightBulbIcon,
    sections: [
      {
        title: 'Chain of Thought',
        items: [
          { label: 'Step-by-Step', description: 'Break down complex tasks' },
          { label: 'Reasoning', description: 'Explain thought process' },
          { label: 'Verification', description: 'Check intermediate steps' },
          { label: 'Iteration', description: 'Refine based on outcomes' }
        ]
      },
      {
        title: 'Role Prompting',
        items: [
          { label: 'Expert Role', description: 'Define specific expertise' },
          { label: 'Perspective', description: 'Set point of view' },
          { label: 'Knowledge', description: 'Specify domain expertise' },
          { label: 'Style', description: 'Define communication style' }
        ]
      }
    ]
  },
  {
    id: 'patterns',
    name: 'Common Patterns',
    icon: BeakerIcon,
    sections: [
      {
        title: 'Task-Specific',
        items: [
          { label: 'Analysis', description: 'Examine and evaluate content' },
          { label: 'Generation', description: 'Create new content' },
          { label: 'Translation', description: 'Convert between formats' },
          { label: 'Summary', description: 'Condense information' }
        ]
      },
      {
        title: 'Output Control',
        items: [
          { label: 'Length', description: 'Specify word/character count' },
          { label: 'Format', description: 'Define structure (JSON, list, etc.)' },
          { label: 'Style', description: 'Set tone and voice' },
          { label: 'Constraints', description: 'Add specific limitations' }
        ]
      }
    ]
  },
  {
    id: 'coding',
    name: 'Code Generation',
    icon: CodeBracketIcon,
    sections: [
      {
        title: 'Structure',
        items: [
          { label: 'Language', description: 'Specify programming language' },
          { label: 'Framework', description: 'Define tech stack' },
          { label: 'Style', description: 'Set coding conventions' },
          { label: 'Documentation', description: 'Request comments and docs' }
        ]
      },
      {
        title: 'Best Practices',
        items: [
          { label: 'Error Handling', description: 'Include edge cases' },
          { label: 'Testing', description: 'Request test cases' },
          { label: 'Performance', description: 'Specify optimization needs' },
          { label: 'Security', description: 'Address security concerns' }
        ]
      }
    ]
  }
];

export default function CheatSheets() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#00ffff] mb-2">Prompt Engineering Cheat Sheets</h2>
        <p className="text-gray-400">Quick reference guides for effective prompt engineering</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {cheatSheets.map((sheet) => {
          const Icon = sheet.icon;
          return (
            <div
              key={sheet.id}
              className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(sheet.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#00ffff]/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-[#00ffff]" />
                  <span className="font-medium text-white">{sheet.name}</span>
                </div>
                <ChevronDownIcon
                  className={`h-5 w-5 text-[#00ffff] transition-transform ${
                    expandedSection === sheet.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === sheet.id && (
                <div className="px-6 pb-6">
                  {sheet.sections.map((section, index) => (
                    <div
                      key={section.title}
                      className={`${index > 0 ? 'mt-6' : 'mt-4'}`}
                    >
                      <h4 className="text-[#00ffff] font-medium mb-3">{section.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.items.map((item) => (
                          <div
                            key={item.label}
                            className="bg-black/30 border border-[#00ffff]/10 rounded-lg p-4"
                          >
                            <div className="font-medium text-white mb-1">{item.label}</div>
                            <div className="text-sm text-gray-400">{item.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Copy Templates */}
      <div className="mt-8 bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Quick Copy Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-[#00ffff]/10 rounded-lg p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {`Role: [Expert type]
Goal: [Specific outcome]
Context: [Background info]
Task: [Clear instruction]
Format: [Output structure]`}
            </pre>
            <Button
              onClick={() => navigator.clipboard.writeText(`Role: [Expert type]
Goal: [Specific outcome]
Context: [Background info]
Task: [Clear instruction]
Format: [Output structure]`)}
              className="mt-3 w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-medium"
            >
              Copy Template
            </Button>
          </div>

          <div className="bg-black/30 border border-[#00ffff]/10 rounded-lg p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {`I want you to act as [role]
Context: [situation/background]
Task: [specific request]
Requirements:
1. [requirement 1]
2. [requirement 2]
3. [requirement 3]
Output format: [desired format]`}
            </pre>
            <Button
              onClick={() => navigator.clipboard.writeText(`I want you to act as [role]
Context: [situation/background]
Task: [specific request]
Requirements:
1. [requirement 1]
2. [requirement 2]
3. [requirement 3]
Output format: [desired format]`)}
              className="mt-3 w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-medium"
            >
              Copy Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 