'use client';

import { useState } from 'react';
import { EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('message', formData.message);
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          role: '',
          message: '',
          resume: null,
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resume: file }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-4">
            Join Our Team
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            While we don't have any current openings, we're always interested in connecting with talented individuals who are passionate about AI and prompt engineering.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Why Join Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-[#00ffff] font-medium">Innovation First</h3>
                <p className="text-white/60">Work on cutting-edge AI technology and shape the future of prompt engineering.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[#00ffff] font-medium">Remote-First Culture</h3>
                <p className="text-white/60">Work from anywhere in the world with our distributed team.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[#00ffff] font-medium">Growth Opportunities</h3>
                <p className="text-white/60">Continuous learning and development in a rapidly evolving field.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[#00ffff] font-medium">Impactful Work</h3>
                <p className="text-white/60">Help democratize access to AI technology and empower users worldwide.</p>
              </div>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Express Interest</h2>
            <p className="text-white/60 mb-8">
              Submit your information below and we'll reach out when relevant opportunities become available.
            </p>

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
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent"
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
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-white/80 mb-2">
                  Interested Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Content">Content</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
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
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself and why you're interested in joining our team..."
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-white/80 mb-2">
                  Resume/CV (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="resume"
                    className="flex items-center px-4 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white/60 hover:text-[#00ffff] hover:border-[#00ffff]/40 cursor-pointer transition-colors"
                  >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    {formData.resume ? 'Change File' : 'Upload File'}
                  </label>
                  {formData.resume && (
                    <span className="text-white/60">{formData.resume.name}</span>
                  )}
                </div>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-500">
                  Thank you for your interest! We'll be in touch if a suitable position becomes available.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
                  Failed to submit your information. Please try again later.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
