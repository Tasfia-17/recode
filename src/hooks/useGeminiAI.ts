import { GoogleGenerativeAI } from '@google/generative-ai';
import { useOpikTrace } from './useOpik';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export function useGeminiAI() {
  const { traceAICall } = useOpikTrace();

  const generateVision = async (userContext: {
    directive?: string;
    dossierData?: Record<string, any>;
    journalEntries?: any[];
  }): Promise<string> => {
    const prompt = `You are an identity transformation coach. Generate an inspiring 2-sentence vision of who this person is becoming (not what they're doing).

Context:
- Directive: ${userContext.directive || 'Not set'}
- Dossier: ${JSON.stringify(userContext.dossierData || {}).substring(0, 200)}
- Recent themes: ${userContext.journalEntries?.slice(0, 2).map(e => e.content?.substring(0, 50)).join('; ') || 'None'}

Vision (2 sentences, identity-focused):`;

    return traceAICall(
      'generate_vision',
      { prompt, context: userContext },
      async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      },
      { feature: 'boss_fight', type: 'vision' }
    );
  };

  const generateAntiVision = async (userContext: {
    directive?: string;
    currentVision?: string;
  }): Promise<string> => {
    const prompt = `Generate a cautionary 2-sentence anti-vision of who they'll become if they DON'T change.

Context:
- Directive: ${userContext.directive || 'Not set'}
- Vision: ${userContext.currentVision || 'Not set'}

Anti-Vision (2 sentences, sobering but not cruel):`;

    return traceAICall(
      'generate_anti_vision',
      { prompt, context: userContext },
      async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      },
      { feature: 'boss_fight', type: 'anti_vision' }
    );
  };

  const analyzeJournal = async (entries: any[]): Promise<{
    themes: string[];
    emotionalTrend: string;
    suggestions: string[];
  }> => {
    const prompt = `Analyze these journal entries:
${entries.slice(0, 5).map((e, i) => `${i + 1}. ${e.content?.substring(0, 100)}`).join('\n')}

Respond in JSON:
{
  "themes": ["theme1", "theme2"],
  "emotionalTrend": "description",
  "suggestions": ["prompt1", "prompt2"]
}`;

    return traceAICall(
      'analyze_journal',
      { entryCount: entries.length },
      async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      },
      { feature: 'journal_analysis' }
    );
  };

  return { generateVision, generateAntiVision, analyzeJournal };
}
