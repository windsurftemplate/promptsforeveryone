'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
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
    title: "Write a Prompt",
    description: "Help me write an effective prompt for..."
  },
  {
    title: "Improve a Prompt",
    description: "Help me improve this existing prompt..."
  },
  {
    title: "Analyze a Prompt",
    description: "Help me understand why this prompt works or doesn't work..."
  },
  {
    title: "Prompt Templates",
    description: "Give me a template for a specific type of prompt..."
  }
];

function ChatContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(searchParams?.get('id'));
  const chatbotRef = useRef<{ setInput: (text: string) => void } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  // Load chat history
  useEffect(() => {
    if (!user) return;

    const chatHistoryRef = query(
      ref(db, `chats/${user.uid}`),
      orderByChild('updatedAt')
    );

    const unsubscribe = onValue(chatHistoryRef, (snapshot) => {
      const chats: ChatHistory[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data) {
          chats.unshift({
            id: childSnapshot.key!,
            title: data.title || 'New Chat',
            lastMessage: data.lastMessage || '',
            timestamp: data.timestamp || new Date().toISOString(),
            messages: data.messages || []
          });
        }
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
    e.stopPropagation();
    if (!user) return;

    try {
      const chatRef = ref(db, `chats/${user.uid}/${chatId}`);
      await set(chatRef, null);
      if (selectedChat === chatId) {
        setSelectedChat(null);
        router.push('/chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Common Prompts */}
          <div className="w-80 space-y-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6] bg-clip-text text-transparent">
              Prompt Templates
            </h2>
            <div className="space-y-2">
              {COMMON_PROMPTS.map((prompt, index) => (
                <div
                  key={index}
                  onClick={() => handlePromptClick(prompt.description)}
                  className="p-3 bg-black/50 border border-[#8B5CF6]/20 rounded-lg hover:border-[#8B5CF6]/40 cursor-pointer transition-all duration-300"
                >
                  <h3 className="text-white font-medium mb-1">{prompt.title}</h3>
                  <p className="text-white/60 text-sm">{prompt.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 max-w-4xl">
            <Chatbot ref={chatbotRef} chatId={selectedChat} />
          </div>

          {/* Right Sidebar - Chat History */}
          <div className="w-80 space-y-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6] bg-clip-text text-transparent">
              Chat History
            </h2>
            <button
              onClick={handleNewChat}
              className="w-full px-4 py-2 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg transition-all duration-300 border border-[#8B5CF6]/30"
            >
              New Chat
            </button>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8B5CF6]/20 scrollbar-track-transparent">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedChat === chat.id
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40'
                      : 'bg-black/50 border border-white/10 hover:border-[#8B5CF6]/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium truncate flex-1 mr-2">
                      {chat.title || 'New Chat'}
                    </h3>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="text-white/40 hover:text-[#8B5CF6] transition-colors p-1"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-white/60 text-sm truncate mt-1">
                    {chat.lastMessage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
} 