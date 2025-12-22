import { GoogleGenAI } from "@google/genai";
import { ARCHIE_SYSTEM_INSTRUCTION } from '../constants';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const sendMessageToArchie = async (message: string, history: {role: 'user' | 'model', parts: { text: string }[]}[] = []) => {
  if (!apiKey) {
    return "I seem to be disconnected from the archive. (Missing API Key)";
  }

  try {
    const model = 'gemini-2.5-flash'; 
    
    // We construct a chat session for context
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: ARCHIE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history
    });

    const result = await chat.sendMessage({
        message: message
    });
    
    return result.text;
  } catch (error) {
    console.error("Archie Error:", error);
    return "I apologize, but I am having trouble retrieving that file right now.";
  }
};