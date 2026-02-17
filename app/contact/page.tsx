'use client';

import { useState } from 'react';
import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Here you would typically send the form data to your API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6] bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help! Fill out the form below or reach out to us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-black/50 backdrop-blur-xl border border-[#8B5CF6]/20 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-[#8B5CF6] mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <a 
                      href="mailto:support@promptsforeveryone.com" 
                      className="text-white/60 hover:text-[#8B5CF6] transition-colors"
                    >
                      support@promptsforeveryone.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPinIcon className="w-6 h-6 text-[#8B5CF6] mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Location</h3>
                    <p className="text-white/60">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-xl border border-[#8B5CF6]/20 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Quick Links</h2>
              <div className="space-y-4">
                <a href="/docs" className="block text-white/60 hover:text-[#8B5CF6] transition-colors">
                  Documentation
                </a>
                <a href="/guides" className="block text-white/60 hover:text-[#8B5CF6] transition-colors">
                  Guides
                </a>
                <a href="/blog" className="block text-white/60 hover:text-[#8B5CF6] transition-colors">
                  Blog
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black/50 backdrop-blur-xl border border-[#8B5CF6]/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/50 border border-[#8B5CF6]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/50 border border-[#8B5CF6]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-white/80 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/50 border border-[#8B5CF6]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white/80 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-black/50 border border-[#8B5CF6]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-transparent resize-none"
                  placeholder="Your message..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-500">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
                  Failed to send message. Please try again later.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 