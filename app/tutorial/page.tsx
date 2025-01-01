'use client';

export default function HowToStartPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          How to Get Started with Prompt Engineering
        </h1>

        {/* Introduction Section */}
        <div className="bg-black border border-[#00ffff]/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#00ffff] mb-4">What is Prompt Engineering?</h2>
          <p className="text-gray-300 mb-4">
            Prompt engineering is the art and science of designing effective prompts for AI models. 
            It's about crafting clear, specific instructions that help AI models generate the most useful and accurate responses.
          </p>
          <p className="text-gray-300">
            As AI technology continues to evolve, the role of prompt engineers becomes increasingly important 
            in bridging the gap between human intent and AI capabilities.
          </p>
        </div>

        {/* Key Concepts Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-[#00ffff] text-xl font-semibold mb-4">Key Concepts</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Understanding context and specificity</li>
              <li>• Crafting clear and concise instructions</li>
              <li>• Managing token limits effectively</li>
              <li>• Handling edge cases and errors</li>
              <li>• Iterative refinement of prompts</li>
            </ul>
          </div>

          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-[#00ffff] text-xl font-semibold mb-4">Best Practices</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Start with clear objectives</li>
              <li>• Use specific examples</li>
              <li>• Break down complex tasks</li>
              <li>• Test and iterate your prompts</li>
              <li>• Document your approaches</li>
            </ul>
          </div>

          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-[#00ffff] text-xl font-semibold mb-4">Common Pitfalls</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Being too vague or ambiguous</li>
              <li>• Overlooking context</li>
              <li>• Ignoring model limitations</li>
              <li>• Not testing edge cases</li>
              <li>• Forgetting to validate outputs</li>
            </ul>
          </div>
        </div>

        {/* Getting Started Steps */}
        <div className="bg-black border border-[#00ffff]/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#00ffff] mb-6">Steps to Get Started</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-[#00ffff] mb-2">1. Learn the Basics</h3>
              <p className="text-gray-300">
                Start by understanding how AI models work and what makes a good prompt. 
                Explore our tutorials and resources to build a strong foundation.
              </p>
            </div>
            <div>
              <h3 className="text-xl text-[#00ffff] mb-2">2. Practice with Our AI Chat</h3>
              <p className="text-gray-300">
                Use our AI chat feature to experiment with different prompts and see how they perform. 
                Learn from the responses and refine your approach.
              </p>
            </div>
            <div>
              <h3 className="text-xl text-[#00ffff] mb-2">3. Create Your First Prompts</h3>
              <p className="text-gray-300">
                Start creating and submitting your own prompts. Begin with simple tasks and 
                gradually increase complexity as you gain confidence.
              </p>
            </div>
            <div>
              <h3 className="text-xl text-[#00ffff] mb-2">4. Join the Community</h3>
              <p className="text-gray-300">
                Engage with other prompt engineers, share your experiences, and learn from their insights. 
                Collaboration is key to improving your skills.
              </p>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-black border border-[#00ffff]/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#00ffff] mb-6">Additional Resources</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl text-[#00ffff] mb-4">Tools and Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• AI Chat for testing prompts</li>
                <li>• Prompt templates and examples</li>
                <li>• Performance analytics</li>
                <li>• Community feedback system</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl text-[#00ffff] mb-4">Learning Materials</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Comprehensive tutorials</li>
                <li>• Case studies and examples</li>
                <li>• Best practices guide</li>
                <li>• Expert interviews and insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
