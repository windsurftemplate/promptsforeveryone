'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

const templateTypes = [
  { id: 'email', name: 'Email Templates', description: 'Professional emails for various business scenarios' },
  { id: 'blog', name: 'Blog Posts', description: 'Engaging blog post structures and outlines' },
  { id: 'lesson', name: 'Lesson Plans', description: 'Structured educational lesson plans' },
  { id: 'social', name: 'Social Media', description: 'Engaging social media posts and threads' },
  { id: 'marketing', name: 'Marketing Copy', description: 'Compelling marketing materials and copy' },
];

interface TemplateFormData {
  type: string;
  purpose: string;
  tone: string;
  length: string;
  additionalInfo: string;
}

export default function TemplateGenerator() {
  const [selectedType, setSelectedType] = useState(templateTypes[0]);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [formData, setFormData] = useState<TemplateFormData>({
    type: 'email',
    purpose: '',
    tone: '',
    length: '',
    additionalInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#00ffff] mb-2">AI-Powered Templates</h2>
        <p className="text-gray-400">Generate professional templates for various purposes using AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Template Type
              </label>
              <Listbox value={selectedType} onChange={setSelectedType}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-black py-3 pl-4 pr-10 text-left border border-[#00ffff]/20 hover:border-[#00ffff]/40 focus:outline-none focus-visible:border-[#00ffff]">
                    <span className="block truncate text-white">{selectedType.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black py-1 border border-[#00ffff]/20">
                    {templateTypes.map((type) => (
                      <Listbox.Option
                        key={type.id}
                        value={type}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                            active ? 'bg-[#00ffff]/10 text-[#00ffff]' : 'text-white'
                          }`
                        }
                      >
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-gray-400">{type.description}</div>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Purpose/Context
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-black border border-[#00ffff]/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffff]/40"
                placeholder="e.g., Follow-up email after client meeting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Tone
              </label>
              <input
                type="text"
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-black border border-[#00ffff]/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffff]/40"
                placeholder="e.g., Professional, Friendly, Formal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Length
              </label>
              <input
                type="text"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-black border border-[#00ffff]/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffff]/40"
                placeholder="e.g., Short (100 words), Medium (300 words)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg bg-black border border-[#00ffff]/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffff]/40"
                placeholder="Any specific details or requirements..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-semibold py-3"
            >
              {loading ? 'Generating...' : 'Generate Template'}
            </Button>
          </form>
        </div>

        <div>
          <div className="sticky top-6">
            <h3 className="text-lg font-medium text-white mb-4">Generated Template</h3>
            <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-6 min-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]"></div>
                </div>
              ) : generatedContent ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-300">{generatedContent}</pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Your generated template will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 