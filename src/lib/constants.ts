import { 
  BeakerIcon, ChatBubbleLeftRightIcon, CodeBracketIcon, 
  DocumentTextIcon, PencilSquareIcon, PhotoIcon, 
  RocketLaunchIcon, WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

export const PRICE_MONTHLY_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_ID;
export const PRICE_YEARLY_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_ID;

export const MAX_FREE_PROMPTS = 50;
export const MAX_FREE_CATEGORIES = 5;

export const SUBSCRIPTION_STATUS = {
  active: 'active',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'incomplete_expired',
  past_due: 'past_due',
  trialing: 'trialing',
  unpaid: 'unpaid',
} as const;

export const CATEGORY_ICONS = {
  writing: PencilSquareIcon,
  coding: CodeBracketIcon,
  image: PhotoIcon,
  chat: ChatBubbleLeftRightIcon,
  academic: DocumentTextIcon,
  business: RocketLaunchIcon,
  technical: WrenchScrewdriverIcon,
  science: BeakerIcon,
} as const;

export const CATEGORY_DESCRIPTIONS = {
  writing: "Enhance your writing with AI-powered prompts for content creation, storytelling, and more.",
  coding: "Boost your programming productivity with prompts for code generation, debugging, and documentation.",
  image: "Create stunning visuals with prompts optimized for image generation AI models.",
  chat: "Improve conversational AI interactions with carefully crafted dialogue prompts.",
  academic: "Excel in academic writing and research with specialized scholarly prompts.",
  business: "Drive business growth with prompts for marketing, strategy, and professional communication.",
  technical: "Master technical documentation and specifications with specialized prompts.",
  science: "Advance scientific research and analysis with domain-specific prompts.",
} as const; 