export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform hover:scale-105 transition-transform duration-300"
      >
        <circle
          cx="16"
          cy="16"
          r="15"
          className="stroke-[#00ffff] stroke-2"
          fill="black"
          opacity="0.2"
        />
        
        <path
          d="M12 8h8a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-4v6"
          className="stroke-[#00ffff] stroke-2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <circle cx="16" cy="12" r="1" fill="#00ffff" />
        <circle cx="16" cy="20" r="1" fill="#00ffff" />
      </svg>
      
      <span className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
        Prompts For Everyone
      </span>
    </div>
  );
} 