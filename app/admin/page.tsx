'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, get, onValue, remove, update, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import AdminPromptGenerator from '../../src/components/admin/AdminPromptGenerator';
import AdDisplay from '@/components/AdDisplay';
import { ads as staticAds, Ad as AdType } from '@/config/ads';
import { motion } from 'framer-motion';
import AdManagement from '@/components/admin/AdManagement';
import { toast } from 'sonner';
import { parseBlogContent, formatBlogContent, generateSlug, BlogPost } from '@/lib/blog';

interface User {
  uid: string;
  email: string;
  role?: string;
  plan?: string;
  createdAt?: string;
  lastLogin?: string;
  promptCount?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
  subcategories?: {
    [key: string]: {
      name: string;
    };
  };
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName?: string;
  category: string;
  subcategory?: string;
  createdAt: string;
  isPrivate?: boolean;
}

interface UserData {
  name?: string;
  email: string;
  role?: string;
  plan?: string;
  createdAt?: string;
  lastLogin?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'blog' | 'categories' | 'prompts' | 'generator' | 'ads'>('users');
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState<AdType[]>(staticAds);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAd, setNewAd] = useState<Partial<AdType>>({
    title: '',
    type: 'inline',
    content: '',
    status: 'inactive'
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [adContentType, setAdContentType] = useState<'image' | 'html'>('image');
  const [htmlContent, setHtmlContent] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [pwaStats, setPwaStats] = useState({ installs: 0 });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Check if user is admin
    const checkAdmin = async () => {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists() || snapshot.val().role !== 'admin') {
        router.push('/');
        return;
      }
    };

    checkAdmin();

    // Fetch all users
    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, async (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = await Promise.all(
          Object.entries(usersData).map(async ([uid, userData]: [string, any]) => {
            // Get prompt count for each user
            const promptsRef = ref(db, `users/${uid}/prompts`);
            const promptsSnapshot = await get(promptsRef);
            const promptCount = promptsSnapshot.exists() ? Object.keys(promptsSnapshot.val()).length : 0;

            return {
              uid,
              email: userData.email,
              role: userData.role || 'user',
              plan: userData.plan || 'free',
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin,
              promptCount,
            };
          })
        );
        setUsers(usersArray);
      }
      setIsLoading(false);
    });

    // Fetch blog posts
    const blogRef = ref(db, 'blog');
    const unsubscribeBlog = onValue(blogRef, (snapshot) => {
      if (snapshot.exists()) {
        const blogData = snapshot.val();
        const blogArray = Object.entries(blogData).map(([id, post]: [string, any]) => ({
          id,
          title: post.title,
          content: post.content,
          date: post.date,
          readTime: post.readTime,
          summary: post.summary,
          slug: post.slug || post.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }));
        setBlogPosts(blogArray);
      } else {
        setBlogPosts([]);
      }
    });

    // Fetch categories
    const categoriesRef = ref(db, 'categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          ...category,
        }));
        setCategories(categoriesArray);
      }
    });

    // Fetch all prompts
    const fetchPrompts = async () => {
      try {
        // Check admin status first
        const adminRef = ref(db, `users/${user.uid}`);
        const adminSnapshot = await get(adminRef);
        if (!adminSnapshot.exists() || adminSnapshot.val().role !== 'admin') {
          router.push('/');
          return;
        }

        // Fetch public prompts
        const publicPromptsRef = ref(db, 'prompts');
        onValue(publicPromptsRef, async (snapshot) => {
          try {
            const publicPrompts: Prompt[] = [];
            if (snapshot.exists()) {
              const data = snapshot.val();
              for (const [id, prompt] of Object.entries(data)) {
                const promptData = prompt as any;
                // Fetch user details
                const userRef = ref(db, `users/${promptData.userId}`);
                const userSnapshot = await get(userRef);
                const userData = userSnapshot.val() as UserData;
                
                // Fetch category details to get subcategory name
                let subcategoryName = '';
                if (promptData.category && promptData.subcategoryId) {
                  const categoryRef = ref(db, `categories/${promptData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                  const categorySnapshot = await get(categoryRef);
                  if (categorySnapshot.exists()) {
                    const categoryData = categorySnapshot.val();
                    subcategoryName = categoryData.subcategories?.[promptData.subcategoryId]?.name || '';
                  }
                }
                
                publicPrompts.push({
                  id,
                  ...promptData,
                  userName: userData?.name || userData?.email || 'Unknown User',
                  subcategory: subcategoryName,
                  isPrivate: false
                });
              }
            }

            // Fetch private prompts from all users
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);
            const privatePrompts: Prompt[] = [];
            
            if (usersSnapshot.exists()) {
              const users = usersSnapshot.val();
              for (const [userId, userData] of Object.entries(users)) {
                const typedUserData = userData as UserData;
                const userPromptsRef = ref(db, `users/${userId}/prompts`);
                const userPromptsSnapshot = await get(userPromptsRef);
                
                if (userPromptsSnapshot.exists()) {
                  const userPrompts = userPromptsSnapshot.val();
                  for (const [promptId, prompt] of Object.entries(userPrompts)) {
                    const promptData = prompt as any;
                    
                    // Fetch category details to get subcategory name
                    let subcategoryName = '';
                    if (promptData.category && promptData.subcategoryId) {
                      const categoryRef = ref(db, `categories/${promptData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                      const categorySnapshot = await get(categoryRef);
                      if (categorySnapshot.exists()) {
                        const categoryData = categorySnapshot.val();
                        subcategoryName = categoryData.subcategories?.[promptData.subcategoryId]?.name || '';
                      }
                    }

                    privatePrompts.push({
                      id: promptId,
                      ...promptData,
                      userName: typedUserData.name || typedUserData.email || 'Unknown User',
                      subcategory: subcategoryName,
                      userId,
                      isPrivate: true
                    });
                  }
                }
              }
            }

            // Combine and sort all prompts by creation date
            const allPrompts = [...publicPrompts, ...privatePrompts].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            setPrompts(allPrompts);
            setError(''); // Clear any previous errors
          } catch (error) {
            console.error('Error processing prompts:', error);
            setError('Error loading prompts. Please try again.');
          }
        });
      } catch (error) {
        console.error('Error in fetchPrompts:', error);
        if (error instanceof Error && error.message.includes('Permission denied')) {
          router.push('/');
        } else {
          setError('Failed to load prompts. Please try again.');
        }
        setPrompts([]);
      }
    };

    fetchPrompts();

    // Fetch PWA stats
    const pwaStatsRef = ref(db, 'stats/pwa');
    const unsubscribePwaStats = onValue(pwaStatsRef, (snapshot) => {
      if (snapshot.exists()) {
        setPwaStats(snapshot.val());
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeBlog();
      unsubscribe();
      unsubscribePwaStats();
    };
  }, [user, router]);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const postRef = ref(db, `blog/${postId}`);
        await remove(postRef);
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const handleSavePost = async (post: BlogPost) => {
    setSaving(true);
    try {
      // Ensure all required fields are present
      const postData = {
        ...post,
        title: post.title || '',
        content: post.content || '',
        date: post.date || new Date().toISOString(),
        readTime: post.readTime || '5 min read',
        summary: post.summary || '',
        author: post.author || 'Anonymous',
        tags: post.tags || [],
        slug: generateSlug(post.title || ''),
        updatedAt: new Date().toISOString()
      };

      const postRef = ref(db, `blog/${post.id}`);
      await set(postRef, postData);
      setEditingPost(null);
      setBlogPosts(blogPosts.map(p => p.id === post.id ? postData : p));
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError('Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const categoryId = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const categoryRef = ref(db, `categories/${categoryId}`);
      await update(categoryRef, {
        name: newCategoryName,
        count: 0,
        subcategories: {}  // Initialize empty subcategories object
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    try {
      const subcategoryRef = ref(db, `categories/${categoryId}/subcategories`);
      const newSubcategoryRef = push(subcategoryRef);
      await update(newSubcategoryRef, {
        name: newSubcategoryName
      });
      setNewSubcategoryName('');
      setIsAddingSubcategory(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error adding subcategory:', error);
      setError('Failed to add subcategory');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      return;
    }

    try {
      const categoryRef = ref(db, `categories/${categoryId}`);
      await remove(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      const subcategoryRef = ref(db, `categories/${categoryId}/subcategories/${subcategoryId}`);
      await remove(subcategoryRef);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      setError('Failed to delete subcategory');
    }
  };

  const handleDeletePrompt = async (prompt: Prompt) => {
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      if (prompt.isPrivate) {
        // Delete from user's private prompts
        await remove(ref(db, `users/${prompt.userId}/prompts/${prompt.id}`));
      } else {
        // Delete from public prompts
        await remove(ref(db, `prompts/${prompt.id}`));
      }

      // Update category count if needed
      if (prompt.category) {
        const categoryRef = ref(db, `categories/${prompt.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        const categorySnapshot = await get(categoryRef);
        if (categorySnapshot.exists()) {
          const categoryData = categorySnapshot.val();
          const currentCount = categoryData.count || 0;
          if (currentCount > 0) {
            await update(categoryRef, { count: currentCount - 1 });
          }
        }
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setError('Failed to delete prompt');
    }
  };

  const handleUpdateUser = async (userId: string, field: 'role' | 'plan', value: string) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        [field]: value
      });
    } catch (error) {
      console.error(`Error updating user ${field}:`, error);
      setError(`Failed to update user ${field}`);
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    let passesUserFilter = true;
    let passesDateFilter = true;
    let passesSearchFilter = true;

    // User filter
    if (selectedUser !== 'all') {
      passesUserFilter = prompt.userId === selectedUser;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const promptDate = new Date(prompt.createdAt);
      const today = new Date();
      const diffTime = today.getTime() - promptDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          passesDateFilter = diffDays <= 1;
          break;
        case 'week':
          passesDateFilter = diffDays <= 7;
          break;
        case 'month':
          passesDateFilter = diffDays <= 30;
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      passesSearchFilter = 
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query);
    }

    return passesUserFilter && passesDateFilter && passesSearchFilter;
  });

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchTerm('');
  };

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

    const newAdData: AdType = {
      id: `${newAd.type}-${Date.now()}`,
      title: newAd.title,
      type: newAd.type as 'banner' | 'inline',
      content: adContent,
      status: newAd.status as 'active' | 'inactive',
      createdAt: new Date().toISOString()
    };

    // Save to database
    const adRef = ref(db, `ads/${newAdData.id}`);
    await set(adRef, newAdData);

    // Update local state
    setAds([...ads, newAdData]);
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
    const adRef = ref(db, `ads/${adId}`);
    await update(adRef, { status: newStatus });
    setAds(ads.map(ad => 
      ad.id === adId ? { ...ad, status: newStatus } : ad
    ));
  };

  const handleAdDelete = async (adId: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      const adRef = ref(db, `ads/${adId}`);
      await remove(adRef);
      setAds(ads.filter(ad => ad.id !== adId));
    }
  };

  const createExamplePosts = async () => {
    try {
      const posts = [
        {
          title: "Getting Started with AI Prompts: A Beginner's Guide",
          content: `
            <article class="prose prose-invert max-w-none">
              <h2>Understanding AI Prompts</h2>
              <p>AI prompts are the key to effective communication with artificial intelligence models. Whether you're using ChatGPT, DALL-E, or any other AI tool, the quality of your results largely depends on how well you craft your prompts.</p>
              
              <h3>Key Elements of a Good Prompt</h3>
              <ul>
                <li><strong>Clear Objective:</strong> Define exactly what you want to achieve</li>
                <li><strong>Specific Context:</strong> Provide relevant background information</li>
                <li><strong>Appropriate Detail:</strong> Include necessary specifics without overloading</li>
                <li><strong>Constraints:</strong> Set clear boundaries and limitations</li>
              </ul>
              
              <h3>Common Prompt Patterns</h3>
              <p>Here are some effective patterns for different use cases:</p>
              <ol>
                <li><strong>Role-based:</strong> "Act as a [role] and help me with [task]"</li>
                <li><strong>Step-by-step:</strong> "Break down the process of [task] into detailed steps"</li>
                <li><strong>Comparative:</strong> "Compare and contrast [A] and [B] in terms of [aspects]"</li>
                <li><strong>Analytical:</strong> "Analyze [topic] from [specific perspectives]"</li>
              </ol>
              
              <h3>Tips for Better Results</h3>
              <p>To get the most out of your AI interactions:</p>
              <ul>
                <li>Be specific about your requirements</li>
                <li>Use clear and concise language</li>
                <li>Break complex requests into smaller parts</li>
                <li>Iterate and refine based on responses</li>
              </ul>
              
              <h3>Practice Exercise</h3>
              <p>Try crafting prompts for these scenarios:</p>
              <ol>
                <li>Writing a product description</li>
                <li>Analyzing a business strategy</li>
                <li>Creating a learning curriculum</li>
                <li>Solving a technical problem</li>
              </ol>
              
              <p>Remember, effective prompt crafting is an iterative process. Don't be afraid to experiment and refine your approach based on the results you receive.</p>
            </article>
          `,
          date: new Date().toISOString(),
          readTime: "8 min read",
          summary: "Learn the fundamentals of crafting effective AI prompts in this comprehensive guide for beginners.",
          tags: ["AI", "Prompts", "Tutorial", "Beginners"],
          author: "AI Expert",
          slug: "getting-started-with-ai-prompts-a-beginners-guide"
        },
        {
          title: "Advanced Techniques for AI Prompt Engineering",
          content: `
            <article class="prose prose-invert max-w-none">
              <h2>Mastering AI Prompt Engineering</h2>
              <p>As AI technology evolves, the art of prompt engineering becomes increasingly sophisticated. This guide explores advanced techniques for crafting prompts that yield exceptional results.</p>
              
              <h3>Advanced Prompt Patterns</h3>
              <ul>
                <li><strong>Chain-of-Thought:</strong> Guide the AI through logical reasoning steps</li>
                <li><strong>Few-Shot Learning:</strong> Provide examples to establish patterns</li>
                <li><strong>Zero-Shot Prompting:</strong> Direct instruction without examples</li>
                <li><strong>Meta-Prompting:</strong> Prompts about improving prompts</li>
              </ul>
              
              <h3>Optimization Strategies</h3>
              <p>Enhance your prompt effectiveness through:</p>
              <ol>
                <li>Temperature and Top-P adjustments</li>
                <li>Context window optimization</li>
                <li>Token efficiency techniques</li>
                <li>Response format control</li>
              </ol>
              
              <h3>Industry Applications</h3>
              <p>Real-world applications in:</p>
              <ul>
                <li>Content Generation</li>
                <li>Code Generation</li>
                <li>Data Analysis</li>
                <li>Creative Writing</li>
              </ul>
              
              <h3>Best Practices</h3>
              <p>Advanced considerations for professional prompt engineering:</p>
              <ul>
                <li>Ethical considerations</li>
                <li>Bias mitigation</li>
                <li>Quality assurance</li>
                <li>Performance monitoring</li>
              </ul>
            </article>
          `,
          date: new Date().toISOString(),
          readTime: "10 min read",
          summary: "Explore advanced techniques in AI prompt engineering, from chain-of-thought prompting to industry applications.",
          tags: ["AI", "Advanced", "Prompt Engineering", "Technical"],
          author: "Prompt Engineer",
          slug: "advanced-techniques-for-ai-prompt-engineering"
        }
      ];

      // Add posts to Firebase
      const blogRef = ref(db, 'blog');
      for (const post of posts) {
        const newPostRef = push(blogRef);
        await set(newPostRef, {
          ...post,
          id: newPostRef.key,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      console.log('Example posts created successfully');
    } catch (error) {
      console.error('Error creating example posts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-[#8B5CF6]/20">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'blog'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'prompts'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Prompts
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'generator'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'ads'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Ads
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B5CF6]"></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Total Users</h3>
                    <p className="text-2xl font-semibold text-white">{users.length}</p>
                  </div>
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Admin Users</h3>
                    <p className="text-2xl font-semibold text-white">
                      {users.filter(user => user.role === 'admin').length}
                    </p>
                  </div>
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">PWA Installs</h3>
                    <p className="text-2xl font-semibold text-white">{pwaStats.installs}</p>
                  </div>
                </div>
                <div className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#8B5CF6]/20">
                          <th className="px-6 py-4 text-left text-[#8B5CF6]">Email</th>
                          <th className="px-6 py-4 text-left text-[#8B5CF6]">Role</th>
                          <th className="px-6 py-4 text-left text-[#8B5CF6]">Plan</th>
                          <th className="px-6 py-4 text-left text-[#8B5CF6]">Prompts</th>
                          <th className="px-6 py-4 text-left text-[#8B5CF6]">Created At</th>
                          <th className="px-6 py-4 text-left text-[#8B5CF6]">Last Login</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr 
                            key={user.uid}
                            className="border-b border-[#8B5CF6]/10 hover:bg-[#8B5CF6]/5 transition-colors"
                          >
                            <td className="px-6 py-4 text-white">{user.email}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  user.role === 'admin' 
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {user.role || 'user'}
                                </span>
                                <button
                                  onClick={() => handleUpdateUser(user.uid, 'role', user.role === 'admin' ? 'user' : 'admin')}
                                  className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 text-sm"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  user.plan === 'paid' 
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {user.plan || 'free'}
                                </span>
                                <button
                                  onClick={() => handleUpdateUser(user.uid, 'plan', user.plan === 'paid' ? 'free' : 'paid')}
                                  className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 text-sm"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-white/60">{user.promptCount}</td>
                            <td className="px-6 py-4 text-white/60">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-white/60">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-white">Blog Posts</h2>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={createExamplePosts}
                    >
                      Create Example Posts
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => router.push('/admin/blog/new')}
                    >
                      New Post
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                <div className="grid gap-6">
                  {editingPost && (
                    <div className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#8B5CF6] mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editingPost.title}
                          onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                          className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8B5CF6]/40"
                          placeholder="Enter post title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B5CF6] mb-2">
                          Summary
                        </label>
                        <textarea
                          value={editingPost.summary}
                          onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                          className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8B5CF6]/40 h-24"
                          placeholder="Enter post summary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B5CF6] mb-2">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={editingPost.readTime}
                          onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                          className="w-full bg-black/50 border border-[#8B5CF6]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8B5CF6]/40"
                          placeholder="e.g., 5 min read"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B5CF6] mb-2">
                          Content (HTML)
                        </label>
                        <div className="border border-[#8B5CF6]/20 rounded-lg overflow-hidden">
                          <textarea
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                            className="w-full h-[70vh] bg-black/50 border-none px-4 py-2 text-white font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/40"
                            placeholder="Enter blog content in HTML format"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="secondary"
                          onClick={() => setEditingPost(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleSavePost(editingPost)}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {!editingPost && (
                    <div className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#8B5CF6]/20">
                              <th className="px-6 py-4 text-left text-[#8B5CF6]">Title</th>
                              <th className="px-6 py-4 text-left text-[#8B5CF6]">Date</th>
                              <th className="px-6 py-4 text-left text-[#8B5CF6]">Read Time</th>
                              <th className="px-6 py-4 text-left text-[#8B5CF6]">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blogPosts.map((post) => (
                              <tr 
                                key={post.id}
                                className="border-b border-[#8B5CF6]/10 hover:bg-[#8B5CF6]/5 transition-colors"
                              >
                                <td className="px-6 py-4 text-white">{post.title}</td>
                                <td className="px-6 py-4 text-white/60">
                                  {new Date(post.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-white/60">{post.readTime}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-3">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setEditingPost(post)}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeletePost(post.id)}
                                    >
                                      <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Total Categories</h3>
                    <p className="text-2xl font-semibold text-white">{categories.length}</p>
                  </div>
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Total Subcategories</h3>
                    <p className="text-2xl font-semibold text-white">
                      {categories.reduce((total, category) => 
                        total + (category.subcategories ? Object.keys(category.subcategories).length : 0), 
                      0)}
                    </p>
                  </div>
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Total Pages</h3>
                    <p className="text-2xl font-semibold text-white">
                      {(() => {
                        // Count static pages
                        let count = 6; // home, categories, explore, blog, about, contact
                        
                        // Count category and subcategory pages
                        categories.forEach(category => {
                          // Add main category page
                          count++;
                          // Add subcategory pages
                          if (category.subcategories) {
                            count += Object.keys(category.subcategories).length;
                          }
                        });
                        
                        // Count prompt pages
                        count += prompts.filter(prompt => !prompt.isPrivate).length;
                        
                        return count;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Categories</h2>
                  <Button
                    onClick={() => setIsAddingCategory(true)}
                    className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-black px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Category
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {isAddingCategory && (
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="w-full bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg p-2 focus:border-[#8B5CF6]/40 focus:outline-none mb-4"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddCategory}
                        className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-black px-4 py-2 rounded-lg transition-colors"
                      >
                        Add Category
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAddingCategory(false);
                          setNewCategoryName('');
                        }}
                        className="bg-black/50 text-white border border-[#8B5CF6]/20 px-4 py-2 rounded-lg hover:border-[#8B5CF6]/40 transition-colors"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">{category.name}</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setIsAddingSubcategory(true);
                            }}
                            className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 transition-colors"
                          >
                            Add Subcategory
                          </Button>
                          <Button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      {selectedCategory === category.id && isAddingSubcategory && (
                        <div className="mb-4 bg-black/20 border border-[#8B5CF6]/10 rounded-lg p-4">
                          <input
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            placeholder="Subcategory name"
                            className="w-full bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg p-2 focus:border-[#8B5CF6]/40 focus:outline-none mb-4"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddSubcategory(category.id)}
                              className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-black px-4 py-2 rounded-lg transition-colors"
                            >
                              Add Subcategory
                            </Button>
                            <Button
                              onClick={() => {
                                setIsAddingSubcategory(false);
                                setNewSubcategoryName('');
                                setSelectedCategory(null);
                              }}
                              className="bg-black/50 text-white border border-[#8B5CF6]/20 px-4 py-2 rounded-lg hover:border-[#8B5CF6]/40 transition-colors"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white/60 mb-2">Subcategories:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(category.subcategories).map(([id, subcategory]) => (
                              <div
                                key={id}
                                className="flex justify-between items-center bg-black/20 border border-[#8B5CF6]/10 rounded-lg p-2"
                              >
                                <span className="text-white">{subcategory.name}</span>
                                <Button
                                  onClick={() => handleDeleteSubcategory(category.id, id)}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Total Prompts</h3>
                    <p className="text-2xl font-semibold text-white">{prompts.length}</p>
                  </div>
                  <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
                    <h3 className="text-[#8B5CF6] text-sm mb-1">Public Prompts</h3>
                    <p className="text-2xl font-semibold text-white">
                      {prompts.filter(prompt => !prompt.isPrivate).length}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="relative flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search prompts..."
                        className="w-64 bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg px-4 py-2 focus:border-[#8B5CF6]/40 focus:outline-none"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-[#8B5CF6] text-black rounded-lg hover:bg-[#8B5CF6]/80 transition-colors"
                      >
                        Search
                      </button>
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-24 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg px-4 py-2"
                    >
                      <option value="all">All Users</option>
                      {users.map((user) => (
                        <option key={user.uid} value={user.uid}>{user.email}</option>
                      ))}
                    </select>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                      className="bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg px-4 py-2"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  <Link href="/prompt/new">
                    <Button variant="default" className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-black">
                      Create New Prompt
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-4">
                  {filteredPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="bg-black/50 border border-[#8B5CF6]/20 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{prompt.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>By {prompt.userName}</span>
                            <span>•</span>
                            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded ${prompt.isPrivate ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                              {prompt.isPrivate ? 'Private' : 'Public'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(prompt.content)}
                            className="p-2 hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                            title="Copy prompt"
                          >
                            <ClipboardDocumentIcon className="h-5 w-5 text-[#8B5CF6]" />
                          </button>
                          <Link
                            href={`/prompt/edit/${prompt.id}`}
                            className="p-2 hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                            title="Edit prompt"
                          >
                            <PencilIcon className="h-5 w-5 text-[#8B5CF6]" />
                          </Link>
                          <button
                            onClick={() => handleDeletePrompt(prompt)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete prompt"
                          >
                            <TrashIcon className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-white/80">{prompt.content}</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg text-sm">
                          {prompt.category}
                        </span>
                        {prompt.subcategory && (
                          <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg text-sm">
                            {prompt.subcategory}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'generator' && (
              <div className="space-y-6">
                <div className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg overflow-hidden p-6">
                  <AdminPromptGenerator />
                </div>
              </div>
            )}

            {activeTab === 'ads' && (
              <AdManagement 
                ads={ads} 
                onUpdateAction={async (newAds) => {
                  setAds(newAds);
                  return Promise.resolve();
                }} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
