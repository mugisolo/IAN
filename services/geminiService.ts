import { GoogleGenAI } from "@google/genai";
import { ARCHIE_SYSTEM_INSTRUCTION } from '../constants';

const PUBLIC_INSTRUCTION = `
You are "Archie", the Public Concierge for IAN (International Association of Former Interpol Officials). 

STRICT DISCLOSURE RESTRICTION:
- DO NOT allow discussion, confirmation, or investigation into any specific person's career, identity, service record, or current status. 
- Even if the person is a known public figure or part of IAN leadership, you must decline to discuss individuals. 
- Privacy and security of our fellows is paramount.

PROFESSIONAL SCOPE:
- Only respond to queries regarding the IAN mission, international law enforcement, types of global crimes (Cybercrime, Transnational Crime, Financial Crime, etc.), intelligence sharing protocols, and the general mandate/history of Interpol.
- If a user asks about an individual, respond: "For security and privacy reasons, I am restricted from discussing the careers or identities of any individuals. I can, however, provide information on the IAN mission, global crime trends, or Interpol's mandate."

GUIDELINES:
- Use Google Search for current global policing trends and news within the permitted scope.
- Maintain a formal, neutral, and educational tone.
- Redirect off-topic or personal inquiries back to the professional scope defined above.
`;

// Shared Gemini client utility on the server with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export const sendMessageToArchie = async (message: string, isPublic: boolean, history: {role: 'user' | 'model', text: string}[] = []) => {
  const model = 'gemini-3.5-flash';
  
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const config = {
    systemInstruction: isPublic ? PUBLIC_INSTRUCTION : ARCHIE_SYSTEM_INSTRUCTION,
    tools: [{ googleSearch: {} }],
    thinkingConfig: isPublic ? { thinkingBudget: 0 } : { thinkingBudget: 1024 },
    temperature: 0.7,
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents,
      config,
    });
    
    return {
      text: result.text || '',
      groundingChunks: result.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Archie API Error:", error);
    throw error;
  }
};

export const analyzeResearchTopic = async (topicTitle: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Perform a deep institutional analysis. TOPIC: ${topicTitle} CONTENT: ${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
        maxOutputTokens: 8000, 
        systemInstruction: "You are the IAN Vault Oracle. Provide high-level strategic reasoning."
      }
    });
    return response.text || '';
  } catch (error) {
    console.error("Analysis Failed:", error);
    return "The analytical engine encountered a processing error.";
  }
};

export const vaultSearch = async (query: string, dataContext: string) => {
  try {
    const model = 'gemini-3.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `SEARCH QUERY: ${query}\n\nDATA CONTEXT (Directory & Archives):\n${dataContext}\n\nBased on the above context, provide an intelligent summary of relevant findings. If the query is a question, answer it. If it's a search for a specific expertise, list the most relevant people or stories and why they match.`,
      config: {
        systemInstruction: "You are the IAN Intelligence Assistant. You help members find relevant information in the collective archive and member directory. Be concise, professional, and secure."
      }
    });
    return response.text || '';
  } catch (error) {
    console.error("Vault Search Error:", error);
    return "The search engine failed to retrieve results.";
  }
};
