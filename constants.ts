import { ModelType } from './types';

export const SYSTEM_INSTRUCTION = `You are Francis-AI, a world-class artificial intelligence assistant. 
Your goal is to provide fast, accurate, and helpful information.
- You are helpful, harmless, and honest.
- You answer questions directly and concisely unless a detailed explanation is required.
- You can write code, essays, emails, and solve complex problems.
- If the user asks for current events or real-time info, use your search tools if enabled.
- Format your response using Markdown. Use code blocks for code snippets.
`;

export const MODEL_LABELS: Record<ModelType, string> = {
  [ModelType.FLASH]: 'Francis Flash (Fast)',
  [ModelType.PRO]: 'Francis Pro (Reasoning)',
};

export const INITIAL_SUGGESTIONS = [
  "What is the latest news in AI?",
  "Write a Python script to scrape a website",
  "Explain quantum computing simply",
  "Plan a trip to Tokyo for 5 days"
];