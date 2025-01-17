export interface Ad {
  id: string;
  title: string;
  type: 'banner' | 'inline';
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const ads: Ad[] = [
  {
    id: 'banner-1',
    title: 'Main Banner Ad',
    type: 'banner',
    content: `
      <div class="flex flex-col items-center justify-center text-center">
        <img 
          src="/images/ads/banner-ad.png" 
          alt="Upgrade to Pro" 
          class="w-full max-w-3xl h-auto rounded-lg shadow-lg mb-4"
        />
        <a href="/pricing" class="mt-2 px-6 py-2 bg-[#00ffff] text-black rounded-lg hover:bg-[#00ffff]/80 transition-colors">
          Learn More
        </a>
      </div>
    `,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'inline-1',
    title: 'Inline Prompt Tips',
    type: 'inline',
    content: `
      <div class="flex flex-col items-center justify-center text-center">
        <img 
          src="/images/ads/inline-ad.png" 
          alt="AI Prompt Coach" 
          class="w-full max-w-md h-auto rounded-lg shadow-lg mb-4"
        />
        <a href="/coach" class="mt-2 text-[#00ffff] hover:underline">Try AI Prompt Coach →</a>
      </div>
    `,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]; 