'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import AdDisplay from '@/components/AdDisplay';
import { Ad } from '@/config/ads';
import { updateAdsAction, updateAdStatusAction, deleteAdAction } from '../../../app/admin/actions';

interface Props {
  ads: Ad[];
  onUpdateAction: (ads: Ad[]) => Promise<void>;
}

export default function AdManagement({ ads, onUpdateAction }: Props) {
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAd, setNewAd] = useState<Partial<Ad>>({
    title: '',
    type: 'inline',
    content: '',
    status: 'inactive'
  });
  const [error, setError] = useState('');
  const [adContentType, setAdContentType] = useState<'image' | 'html'>('image');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.title || !newAd.type) {
      setError('Please fill in all required fields');
      return;
    }

    const adContent = adContentType === 'image' && imagePreview 
      ? `<div class="flex justify-center items-center h-full">
          <img src="${imagePreview}" alt="${newAd.title}" class="max-h-full max-w-full object-contain" />
         </div>`
      : htmlContent;

    const newAdData: Ad = {
      id: `${newAd.type}-${Date.now()}`,
      title: newAd.title,
      type: newAd.type as 'banner' | 'inline',
      content: adContent,
      status: newAd.status as 'active' | 'inactive',
      createdAt: new Date().toISOString()
    };

    const updatedAds = [...ads, newAdData];
    await updateAdsAction(updatedAds);
    await onUpdateAction(updatedAds);

    setIsAddingAd(false);
    setNewAd({
      title: '',
      type: 'inline',
      content: '',
      status: 'inactive'
    });
    setSelectedImage(null);
    setImagePreview(null);
    setHtmlContent('');
  };

  const handleAdStatusChange = async (adId: string, newStatus: 'active' | 'inactive') => {
    await updateAdStatusAction(adId, newStatus);
    await onUpdateAction(ads.map(ad => 
      ad.id === adId ? { ...ad, status: newStatus } : ad
    ));
  };

  const handleAdDelete = async (adId: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      await deleteAdAction(adId);
      await onUpdateAction(ads.filter(ad => ad.id !== adId));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Ad Management</h2>
        <Button
          onClick={() => setIsAddingAd(true)}
          className="bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20"
        >
          Add New Ad
        </Button>
      </div>

      {isAddingAd && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 border border-[#8B5CF6]/20 rounded-lg p-6"
        >
          <form onSubmit={handleAdSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded px-4 py-2 text-white"
                placeholder="Ad Title"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Type</label>
              <select
                value={newAd.type}
                onChange={(e) => setNewAd({ ...newAd, type: e.target.value as 'banner' | 'inline' })}
                className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded px-4 py-2 text-white"
              >
                <option value="banner">Banner</option>
                <option value="inline">Inline</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Content Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="image"
                    checked={adContentType === 'image'}
                    onChange={(e) => setAdContentType(e.target.value as 'image' | 'html')}
                    className="mr-2"
                  />
                  <span className="text-white">Image</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="html"
                    checked={adContentType === 'html'}
                    onChange={(e) => setAdContentType(e.target.value as 'image' | 'html')}
                    className="mr-2"
                  />
                  <span className="text-white">HTML</span>
                </label>
              </div>
            </div>

            {adContentType === 'image' ? (
              <div>
                <label className="block text-white mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded px-4 py-2 text-white"
                />
                {imagePreview && (
                  <div className="mt-4 h-48 flex justify-center">
                    <img src={imagePreview} alt="Preview" className="h-full object-contain" />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-white mb-2">HTML Content</label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full h-48 bg-black/50 border border-[#8B5CF6]/20 rounded px-4 py-2 text-white font-mono"
                  placeholder="Enter HTML content"
                />
              </div>
            )}

            <div>
              <label className="block text-white mb-2">Status</label>
              <select
                value={newAd.status}
                onChange={(e) => setNewAd({ ...newAd, status: e.target.value as 'active' | 'inactive' })}
                className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded px-4 py-2 text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <p className="text-red-500">{error}</p>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20"
              >
                Add Ad
              </Button>
              <Button
                type="button"
                onClick={() => setIsAddingAd(false)}
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-6">
        {ads.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/50 border border-[#8B5CF6]/20 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{ad.title}</h3>
                <p className="text-[#8B5CF6]/60">Type: {ad.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={ad.status}
                  onChange={(e) => handleAdStatusChange(ad.id, e.target.value as 'active' | 'inactive')}
                  className="bg-black/50 border border-[#8B5CF6]/20 rounded px-3 py-1 text-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button
                  onClick={() => handleAdDelete(ad.id)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="h-[180px] bg-black/30 rounded-lg overflow-hidden">
              <AdDisplay ad={ad} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 