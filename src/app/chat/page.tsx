'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(searchParams?.get('id'));
  const chatbotRef = useRef<{ setInput: (text: string) => void } | null>(null);

  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const isUserPro = userData.isPro === true || userData.stripeSubscriptionStatus === 'active';
          setIsPro(isUserPro);
          if (!isUserPro) {
            router.push('/pro-plan');
          }
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProStatus();
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
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`p-3 bg-black border ${
                    selectedChat === chat.id ? 'border-[#00ffff]' : 'border-[#00ffff]/20'
                  } rounded-lg hover:bg-[#00ffff]/5 transition-colors cursor-pointer group relative`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#00ffff] font-semibold text-sm truncate">
                        {chat.title || 'Untitled Chat'}
                      </h3>
                      <p className="text-gray-400 text-xs truncate mt-1">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity px-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {chatHistory.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-4">
                  No chat history yet
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1">
            <div className="w-full">
              <Chatbot ref={chatbotRef} chatId={selectedChat} />
            </div>
          </div>

          {/* Common Prompts Sidebar */}
          <div className="w-80 space-y-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
              Common Prompts
            </h2>
            <div className="space-y-3">
              {COMMON_PROMPTS.map((prompt, index) => (
                <div
                  key={index}
                  onClick={() => handlePromptClick(prompt.description)}
                  className="p-4 bg-black border border-[#00ffff]/20 rounded-lg hover:bg-[#00ffff]/5 transition-colors cursor-pointer"
                >
                  <h3 className="text-[#00ffff] font-semibold mb-2">{prompt.title}</h3>
                  <p className="text-gray-400 text-sm">{prompt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 