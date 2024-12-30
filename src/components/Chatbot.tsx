'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ref as dbRef, push, set, get } from 'firebase/database';
import { db } from '@/lib/firebase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotRef {
  setInput: (text: string) => void;
}

interface ChatbotProps {
  chatId?: string | null;
}

const Chatbot = forwardRef<ChatbotRef, ChatbotProps>(({ chatId }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useImperativeHandle(ref, () => ({
    setInput: (text: string) => {
      setInput(text);
    }
  }));

  // Load chat history when chatId changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId || !user) return;
      
      try {
        const chatRef = dbRef(db, `chats/${user.uid}/${chatId}`);
        const snapshot = await get(chatRef);
        if (snapshot.exists()) {
          const chatData = snapshot.val();
          const loadedMessages = chatData.messages || [];
          // Ensure the loaded messages match the Message type
          setMessages(loadedMessages.map((msg: any) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    setMessages([]); // Clear messages when changing chats
    loadChatHistory();
  }, [chatId, user]);

  const scrollToBottom = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChat = async (newMessages: Message[]) => {
    if (!user) return;

    try {
      // If we have a chatId, update the existing chat
      // If not, create a new chat session
      const chatRef = chatId 
        ? dbRef(db, `chats/${user.uid}/${chatId}`)
        : push(dbRef(db, `chats/${user.uid}`));
      
      // Get the first user message for the title
      const firstUserMessage = newMessages.find(m => m.role === 'user');
      
      await set(chatRef, {
        title: firstUserMessage?.content.slice(0, 30) + '...' || 'New Chat',
        lastMessage: newMessages[newMessages.length - 1].content,
        messages: newMessages,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // If this is a new chat, redirect to include the chat ID
      if (!chatId) {
        const newChatId = chatRef.key;
        if (newChatId) {
          window.location.href = `/chat?id=${newChatId}`;
        }
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    const currentInput = input.trim();
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('You must be logged in to use the chat');
      }

      const token = await user.getIdToken();
      console.log('Sending message to API...');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages
        })
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Response parsing error:', error);
        console.error('Raw response:', responseText);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveChat(finalMessages);
    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error.message || 'An error occurred while sending your message');
      setMessages(messages); // Revert to previous messages
    } finally {
      setIsLoading(false);
    }
  };

  const saveAsPrompt = async () => {
    if (!user) return;
    
    try {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      
      if (!lastUserMessage || !lastAssistantMessage) {
        throw new Error('No conversation to save');
      }

      // Save prompt data to localStorage for the submit page
      const promptData = {
        title: lastUserMessage.content.slice(0, 50),
        description: lastUserMessage.content,
        content: lastAssistantMessage.content,
        categories: ['AI Generated']
      };
      localStorage.setItem('draftPrompt', JSON.stringify(promptData));

      // Redirect to submit page
      window.location.href = '/submit';
    } catch (error: any) {
      console.error('Error preparing prompt:', error);
      alert('Failed to prepare prompt: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col h-[800px] bg-black rounded-lg border border-[#00ffff]/20">
      <div className="p-4 border-b border-[#00ffff]/20 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
          AI Prompt Engineer
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setMessages([]);
              setInput('');
              setError(null);
              if (chatId) {
                window.location.href = '/chat';
              }
            }}
            className="px-4 py-2 text-sm bg-black text-[#00ffff] border border-[#00ffff] rounded hover:bg-[#00ffff]/10 transition-colors"
          >
            New Chat
          </button>
          <button
            onClick={saveAsPrompt}
            disabled={messages.length === 0}
            className="px-4 py-2 text-sm bg-black text-[#00ffff] border border-[#00ffff] rounded hover:bg-[#00ffff]/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Save as Prompt
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#00ffff]/20 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            Start a conversation with the AI assistant to help create your prompt
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 text-center">
            {error}
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#00ffff]/10 border border-[#00ffff]/20 text-white'
                  : 'bg-black border border-[#00ffff]/20 text-gray-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black border border-[#00ffff]/20 text-gray-200 rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#00ffff]/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the prompt you want to create..."
            className="flex-1 bg-black text-white rounded-lg px-4 py-2 border border-[#00ffff]/20 focus:outline-none focus:border-[#00ffff]/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-black text-[#00ffff] border border-[#00ffff] rounded-lg hover:bg-[#00ffff]/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
});

Chatbot.displayName = 'Chatbot';

export default Chatbot; 