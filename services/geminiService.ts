import { GoogleGenAI, Content, GenerateContentResponse, Tool } from "@google/genai";
import { ModelType, Message } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

// Helper to convert internal Message type to Gemini Content type
const mapMessagesToHistory = (messages: Message[]): Content[] => {
  return messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
};

export const streamChatResponse = async (
  currentMessages: Message[],
  newMessage: string,
  model: ModelType,
  isSearchEnabled: boolean,
  location: { lat: number; lng: number } | null,
  onChunk: (text: string) => void,
  onComplete: (fullText: string, groundingMetadata?: any) => void,
  onError: (error: Error) => void
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Tools configuration
    let tools: Tool[] | undefined = undefined;
    let toolConfig = undefined;

    if (isSearchEnabled) {
      tools = [{ googleSearch: {} }, { googleMaps: {} }];
      
      if (location) {
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        };
      }
    }

    // Create a new chat session with history
    const chat = ai.chats.create({
      model: model,
      history: mapMessagesToHistory(currentMessages),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        toolConfig: toolConfig,
      }
    });

    const resultStream = await chat.sendMessageStream({ message: newMessage });

    let fullText = '';
    let groundingMetadata = undefined;

    for await (const chunk of resultStream) {
      const typedChunk = chunk as GenerateContentResponse;
      
      // Accumulate text
      const text = typedChunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }

      // Capture grounding metadata if present (usually in the last chunks)
      if (typedChunk.candidates?.[0]?.groundingMetadata) {
        groundingMetadata = typedChunk.candidates[0].groundingMetadata;
      }
    }

    onComplete(fullText, groundingMetadata);

  } catch (error) {
    console.error("Gemini API Error:", error);
    onError(error instanceof Error ? error : new Error("Unknown error occurred"));
  }
};