'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get, update, remove } from 'firebase/database';
import { Prompt, PromptCategory } from '@/types/prompt';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

// Public categories
const publicCategories: PromptCategory[] = [
  'General Prompts',
  'Project Initialization & Setup',
  'Frontend Design & Development',
  'Backend Development',
  'Database Design & Integration',
  'Full-Stack Features',
  'Styling & Theming',
  'Responsive Design',
  'Forms & User Input Handling',
  'API Integration & Development',
  'Animations & Interactivity',
  'E-Commerce Features',
  'Authentication & Security',
  'Testing & Debugging',
  'Performance Optimization',
  'DevOps & Deployment',
  'Internationalization & Localization',
  'Real-Time Features',
  'Documentation & Knowledge Sharing',
  'Accessibility & Compliance',
  'Workflow Automation',
  'Third-Party Integration',
  'Algorithm & Data Structures',
  'Custom Components & Utilities'
];

interface Props {
  params: {
    id: string;
  };
}

export default function PromptPage({ params: { id } }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<Prompt | null>(null);
  const [privateCategories, setPrivateCategories] = useState<{ name: string; subcategories: string[] }[]>([]);

  // Load prompt data
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const promptRef = ref(db, `prompts/${id}`);
        const snapshot = await get(promptRef);
        
        if (snapshot.exists()) {
          const promptData = snapshot.val();
          setPrompt({ ...promptData, id });
          setEditedPrompt({ ...promptData, id });
        } else {
          setError('Prompt not found');
        }
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError('Failed to fetch prompt');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  // Load private categories
  useEffect(() => {
    const loadPrivateCategories = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = ref(db, `users/${user.uid}/categories`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        if (userData) {
          const categories = Object.values(userData).map((cat: any) => ({
            name: cat.name,
            subcategories: cat.subcategories || []
          }));
          setPrivateCategories(categories);
        }
      } catch (error) {
        console.error('Error loading private categories:', error);
      }
    };

    loadPrivateCategories();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!editedPrompt || !user) return;

    try {
      const promptRef = ref(db, `prompts/${id}`);
      await update(promptRef, {
        ...editedPrompt,
        updatedAt: new Date().toISOString()
      });
      setPrompt(editedPrompt);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating prompt:', err);
      setError('Failed to update prompt');
    }
  };

  const handleDelete = async () => {
    if (!user || !prompt) return;
    
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      const promptRef = ref(db, `prompts/${id}`);
      await remove(promptRef);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setError('Failed to delete prompt');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'An error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPrompt?.title}
                  onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <h1 className="text-2xl font-bold">{prompt.title}</h1>
              )}
            </div>
            <div className="flex space-x-2">
              {prompt.userId === user?.uid && (
                <>
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(true)}>Edit</Button>
                      <Button variant="ghost" onClick={handleDelete}>Delete</Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editedPrompt?.description}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={editedPrompt?.content}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, content: e.target.value } : null)}
                    rows={8}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={editedPrompt?.category}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, category: e.target.value as PromptCategory } : null)}
                    className="w-full px-3 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {privateCategories.length > 0 && (
                      <optgroup label="Private Categories">
                        {privateCategories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Public Categories">
                      {publicCategories.map((category: PromptCategory) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input
                    type="text"
                    value={editedPrompt?.tags?.join(', ') || ''}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) } : null)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-medium mb-2">Description</h2>
                  <p className="text-white/70">{prompt.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Content</h2>
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-white/5 p-4 rounded-lg">
                    {prompt.content}
                  </pre>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Category</h2>
                    <p className="text-white/70">{prompt.category}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium mb-2">Visibility</h2>
                    <p className="text-white/70 capitalize">{prompt.visibility}</p>
                  </div>
                </div>

                {prompt.tags && prompt.tags.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-2">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/5 text-white/70 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-sm text-white/50">
            <p>Created by {prompt.userName} on {new Date(prompt.createdAt).toLocaleDateString()}</p>
            <p>Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
