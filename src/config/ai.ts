export interface AIModelSettings {
  max_tokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
  repetition_penalty: number;
  stop: string[];
}

export interface ChatModelSettings {
  max_tokens: number;
  temperature: number;
  top_p: number;
}

export interface AIConfig {
  model: string;
  chatModel: string;
  settings: AIModelSettings;
  chatSettings: ChatModelSettings;
}

export const AI_CONFIG: AIConfig = {
  model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
  chatModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K',
  settings: {
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ['</s>', '[/INST]']
  },
  chatSettings: {
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.7
  }
}; 