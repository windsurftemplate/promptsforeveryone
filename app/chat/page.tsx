'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { ref, get, onValue, query, orderByChild, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import Chatbot from '@/components/Chatbot';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const COMMON_PROMPTS = [
  {
    title: "Code Review",
    description: "Review this code for best practices and potential improvements..."
  },
  {
    title: "Bug Fix",
    description: "Help me fix this bug in my code..."
  },
  {
    title: "Feature Implementation",
    description: "Help me implement this feature..."
  },
  {
    title: "Code Optimization",
    description: "Help me optimize this code for better performance..."
  }
];

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const { user, isPro } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(searchParams?.get('id'));
  const chatbotRef = useRef<{ setInput: (text: string) => void } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const checkProStatus = async () => {
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const isUserPro = userData.role === 'admin' || userData.plan === 'paid';
          if (!isUserPro) {
            router.push('/pro-plan');
            return;
          }
        } else {
          router.push('/pro-plan');
          return;
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
        router.push('/pro-plan');
        return;
      }
    };

    checkProStatus();
    setLoading(false);
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const chatHistoryRef = query(
      ref(db, `chats/${user.uid}`),
      orderByChild('updatedAt')
    );

    const unsubscribe = onValue(chatHistoryRef, (snapshot) => {
      const chats: ChatHistory[] = [];
      snapshot.forEach((childSnapshot) => {
        chats.unshift({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        });
      });
      setChatHistory(chats);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNewChat = () => {
    setSelectedChat(null);
    router.push('/chat');
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    router.push(`/chat?id=${chatId}`);
  };

  const handlePromptClick = (description: string) => {
    if (chatbotRef.current) {
      chatbotRef.current.setInput(description);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    if (!user) return;

    try {
      const chatRef = ref(db, `chatHistory/${user.uid}/${chatId}`);
      await set(chatRef, null);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (!isPro) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Chat History Sidebar */}
          <div className="w-64 space-y-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
              Chat History
            </h2>
            <button
              onClick={handleNewChat}
              className="w-full px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 border border-[#00ffff]/30"
            >
              New Chat
            </button>
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedChat === chat.id
                      ? 'bg-[#00ffff]/20 border border-[#00ffff]/40'
                      : 'bg-black/50 border border-white/10 hover:border-[#00ffff]/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium truncate">{chat.title || 'New Chat'}</h3>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="text-white/40 hover:text-[#00ffff] transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-white/60 text-sm truncate">{chat.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Common Prompts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMON_PROMPTS.map((prompt, index) => (
                  <div
                    key={index}
                    onClick={() => handlePromptClick(prompt.description)}
                    className="p-4 bg-black/50 border border-[#00ffff]/20 rounded-lg hover:border-[#00ffff]/40 cursor-pointer transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{prompt.title}</h3>
                    <p className="text-white/60 text-sm">{prompt.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <Chatbot ref={chatbotRef} chatId={selectedChat} />
          </div>
        </div>
      </div>
    </div>
  );
} 