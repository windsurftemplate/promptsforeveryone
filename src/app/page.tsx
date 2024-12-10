import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Discover Windsurf IDE Prompts
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Enhance your development workflow with community-curated prompts designed specifically for Windsurf IDE's AI assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Prompts */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
          <a href="/prompts" className="button-secondary button-small">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { name: 'Code Review', icon: '🔍', count: '45 prompts', color: 'bg-blue-100 text-blue-800' },
            { name: 'Testing', icon: '🧪', count: '38 prompts', color: 'bg-green-100 text-green-800' },
            { name: 'Refactoring', icon: '♻️', count: '32 prompts', color: 'bg-purple-100 text-purple-800' },
            { name: 'Documentation', icon: '📚', count: '29 prompts', color: 'bg-yellow-100 text-yellow-800' },
            { name: 'Bug Fixing', icon: '🐛', count: '41 prompts', color: 'bg-red-100 text-red-800' },
            { name: 'Performance', icon: '⚡', count: '25 prompts', color: 'bg-orange-100 text-orange-800' },
            { name: 'Security', icon: '🔒', count: '27 prompts', color: 'bg-teal-100 text-teal-800' },
            { name: 'Best Practices', icon: '✨', count: '35 prompts', color: 'bg-indigo-100 text-indigo-800' },
          ].map((category) => (
            <a
              key={category.name}
              href={`/prompts?category=${category.name.toLowerCase()}`}
              className="card group p-4 flex flex-col items-center text-center hover:scale-105 transition-all duration-200"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${category.color}`}>
                {category.count}
              </span>
            </a>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Prompts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Code Review Prompt Card */}
          <div className="card group p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Code Review</span>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Code Review</h3>
            <p className="text-gray-600 mb-4">
              A detailed prompt for reviewing code quality, best practices, and potential improvements in any programming language.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  JD
                </div>
                <span className="text-sm text-gray-600 ml-2">Jane Developer</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors group-hover:translate-x-1 duration-200">
                View Details →
              </button>
            </div>
          </div>

          {/* Test Generation Prompt Card */}
          <div className="card group p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Testing</span>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.8
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Test Generator</h3>
            <p className="text-gray-600 mb-4">
              Generate comprehensive test cases with edge cases and assertions for your functions and classes.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                  TS
                </div>
                <span className="text-sm text-gray-600 ml-2">Test Smith</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors group-hover:translate-x-1 duration-200">
                View Details →
              </button>
            </div>
          </div>

          {/* Refactoring Prompt Card */}
          <div className="card group p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Refactoring</span>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.7
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Code Refactoring Expert</h3>
            <p className="text-gray-600 mb-4">
              Transform complex code into clean, maintainable, and efficient implementations following best practices.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                  RC
                </div>
                <span className="text-sm text-gray-600 ml-2">Refactor Coach</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors group-hover:translate-x-1 duration-200">
                View Details →
              </button>
            </div>
          </div>

          {/* Documentation Generator Card */}
          <div className="card group p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Documentation</span>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Documentation Writer</h3>
            <p className="text-gray-600 mb-4">
              Generate clear, comprehensive documentation for your code with examples and explanations.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-medium">
                  DW
                </div>
                <span className="text-sm text-gray-600 ml-2">Doc Writer</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors group-hover:translate-x-1 duration-200">
                View Details →
              </button>
            </div>
          </div>

          {/* Performance Optimization Card */}
          <div className="card group p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Performance</span>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.8
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Optimizer</h3>
            <p className="text-gray-600 mb-4">
              Identify and fix performance bottlenecks in your code with optimized solutions and best practices.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                  PO
                </div>
                <span className="text-sm text-gray-600 ml-2">Perf Optimizer</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors group-hover:translate-x-1 duration-200">
                View Details →
              </button>
            </div>
          </div>

          {/* Security Audit Card */}
          <div className="card group p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">Security</span>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.7
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Security Auditor</h3>
            <p className="text-gray-600 mb-4">
              Analyze code for security vulnerabilities and suggest secure coding practices and fixes.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium">
                  SA
                </div>
                <span className="text-sm text-gray-600 ml-2">Security Pro</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors group-hover:translate-x-1 duration-200">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
