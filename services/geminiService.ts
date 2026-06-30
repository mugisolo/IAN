
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

export const getArchieStream = async (message: string, isPublic: boolean, history: {role: 'user' | 'model', text: string}[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
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
    const result = await ai.models.generateContentStream({
      model,
      contents,
      config,
    });
    return result;
  } catch (error) {
    console.error("Archie Streaming Error:", error);
    throw error;
  }
};

export const analyzeResearchTopic = async (topicTitle: string, content: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep institutional analysis. TOPIC: ${topicTitle} CONTENT: ${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        maxOutputTokens: 24000, 
        systemInstruction: "You are the IAN Vault Oracle. Provide high-level strategic reasoning."
      }
    });
    return response.text;
  } catch (error) {
    console.debug("Analysis Failed:", error);
    return "The analytical engine encountered a processing error.";
  }
};

export const vaultSearch = async (query: string, dataContext: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `SEARCH QUERY: ${query}\n\nDATA CONTEXT (Directory & Archives):\n${dataContext}\n\nBased on the above context, provide an intelligent summary of relevant findings. If the query is a question, answer it. If it's a search for a specific expertise, list the most relevant people or stories and why they match.`,
      config: {
        systemInstruction: "You are the IAN Intelligence Assistant. You help members find relevant information in the collective archive and member directory. Be concise, professional, and secure."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Vault Search Error:", error);
    return "The search engine failed to retrieve results.";
  }
};
