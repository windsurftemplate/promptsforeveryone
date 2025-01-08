import { useEffect, useState } from 'react';

const ChatWindow = () => {
  const messages = [
    "A Library of AI Prompts to Spark Your Creativity",
    "AI Prompts to Inspire, Create, and Solve",
    "Let's build something amazing together!",
    "AI Prompts Made Simple"
  ];
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation on mount
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (charIndex < messages[messageIndex].length) {
      // Type out current message
      const typingTimer = setTimeout(() => {
        setCurrentMessage(prev => prev + messages[messageIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(typingTimer);
    } else {
      // Move to next message after delay
      const nextMessageTimer = setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setCurrentMessage('');
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(nextMessageTimer);
    }
  }, [charIndex, messageIndex]);

  return (
    <div 
      className={`w-[600px] h-[740px] bg-[#202123] rounded-xl shadow-2xl border border-[#00ffff]/20 flex flex-col relative transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#00ffff]/20 bg-[#202123]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-[#00ffff] font-medium">AI Assistant</div>
        <div className="w-16"></div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#343541] scrollbar-thin scrollbar-thumb-[#00ffff]/20 scrollbar-track-transparent">
        {/* System Message */}
        <div className="flex justify-start animate-fadeIn">
          <div className="flex space-x-4 max-w-[90%]">
            <div className="w-9 h-9 rounded-full bg-[#00ffff] flex items-center justify-center text-black text-sm font-semibold shrink-0">
              AI
            </div>
            <div className="bg-[#444654] p-4 rounded-2xl text-gray-100 leading-relaxed shadow-lg border border-[#00ffff]/10">
              Welcome to PFE! I'm your AI assistant, ready to help you discover and create amazing prompts.
            </div>
          </div>
        </div>

        {/* Current Message */}
        <div className="flex justify-start animate-slideIn">
          <div className="flex space-x-4 max-w-[90%]">
            <div className="w-9 h-9 rounded-full bg-[#00ffff] flex items-center justify-center text-black text-sm font-semibold shrink-0">
              AI
            </div>
            <div className="bg-[#444654] p-4 rounded-2xl text-gray-100 leading-relaxed shadow-lg border border-[#00ffff]/10">
              {currentMessage}
              <span className="inline-block w-2 h-5 ml-1 bg-[#00ffff] animate-blink">▋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#202123] border-t border-[#00ffff]/20">
        <div className="bg-[#40414f] rounded-xl border border-[#00ffff]/20 p-3 flex items-center shadow-lg transform transition-all duration-300 hover:border-[#00ffff]/40">
          <input
            type="text"
            placeholder="Message AI assistant..."
            className="bg-transparent border-0 focus:ring-0 text-gray-200 flex-1 px-2 placeholder-gray-500"
            disabled
          />
          <button className="p-1.5 rounded-lg hover:bg-[#00ffff]/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#00ffff]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 