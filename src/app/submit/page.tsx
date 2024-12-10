'use client';

import { useState } from 'react';

export default function SubmitPromptPage() {
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'ChatGPT',
    'Image Generation',
    'Code Assistant',
    'Writing',
    'Translation',
    'Data Analysis',
    'Other'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit a Prompt</h1>
          <p className="mt-2 text-gray-600">
            Share your prompt with the community. Be sure to include clear instructions and examples.
          </p>
        </div>

        <form className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="E.g., Professional Email Writer"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe what your prompt does and how it helps users..."
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="E.g., email, business, professional (comma separated)"
              />
            </div>
          </div>

          {/* Prompt Content */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Prompt Content</h2>
            
            <div className="space-y-4">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    !previewMode
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    previewMode
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300'
                  }`}
                >
                  Preview
                </button>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Prompt Template
                </label>
                <textarea
                  id="prompt"
                  rows={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                  placeholder="Enter your prompt template here. Use {placeholders} for variable inputs..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use {'{placeholders}'} for variables that users should replace.
                </p>
              </div>

              <div>
                <label htmlFor="variables" className="block text-sm font-medium text-gray-700">
                  Variable Descriptions
                </label>
                <textarea
                  id="variables"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe each variable in your prompt template:
- {purpose}: The main goal of the email
- {recipient}: The person or group receiving the email
..."
                />
              </div>
            </div>
          </div>

          {/* Example Usage */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Example Usage</h2>
            
            <div>
              <label htmlFor="example-input" className="block text-sm font-medium text-gray-700">
                Example Input
              </label>
              <textarea
                id="example-input"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                placeholder="Provide an example of how to use your prompt..."
              />
            </div>

            <div>
              <label htmlFor="example-output" className="block text-sm font-medium text-gray-700">
                Example Output
              </label>
              <textarea
                id="example-output"
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                placeholder="Show what the AI might generate given your example input..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
