'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Prompts For Everyone',
      description: 'Your ultimate AI prompt management platform. Create, share, and discover high-quality prompts for all your AI needs.',
      icon: (
        <svg className="w-16 h-16 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
    },
    {
      title: 'Browse 1000+ Prompts',
      description: 'Explore our extensive library organized by categories. Find prompts for marketing, coding, writing, and more.',
      icon: (
        <svg className="w-16 h-16 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      cta: 'Browse Categories',
      href: '/categories',
    },
    {
      title: 'Create Your First Prompt',
      description: 'Share your expertise with the community. Submit your own prompts and help others unlock the power of AI.',
      icon: (
        <svg className="w-16 h-16 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      cta: 'Create Prompt',
      href: '/submit',
    },
  ];

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleSkip} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-[#0A0A0F] border border-[#8B5CF6]/20 rounded-2xl p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              {currentStepData.icon}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-[#8B5CF6]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            {currentStepData.href ? (
              <Link
                href={currentStepData.href}
                onClick={onClose}
                className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium"
              >
                {currentStepData.cta}
              </Link>
            ) : null}

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium border border-white/10"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>

            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-white/60 hover:text-white transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
