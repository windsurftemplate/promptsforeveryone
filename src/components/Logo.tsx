export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform hover:scale-105 transition-transform duration-300"
      >
        <rect width="512" height="512" rx="128" fill="black"/>
        <defs>
          <linearGradient id="chatGradient" x1="156" y1="124" x2="356" y2="356" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="white" />
            <stop offset="100%" stop-color="#0099ff" />
          </linearGradient>
        </defs>
        <path 
          d="M356 192C356 154.5 325.5 124 288 124H224C186.5 124 156 154.5 156 192V256C156 293.5 186.5 324 224 324H244L276 356L308 324H288C325.5 324 356 293.5 356 256V192Z" 
          stroke="url(#chatGradient)" 
          strokeWidth="24" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M208 208H304" 
          stroke="url(#chatGradient)" 
          strokeWidth="24" 
          strokeLinecap="round"
        />
        <path 
          d="M208 256H272" 
          stroke="url(#chatGradient)" 
          strokeWidth="24" 
          strokeLinecap="round"
        />
      </svg>
      
      <span className="text-xl font-bold text-white">
        Prompts For Everyone
      </span>
    </div>
  );
} 