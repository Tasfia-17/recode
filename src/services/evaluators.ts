import Opik from 'opik';
import { GoogleGenerativeAI } from '@google/generative-ai';

const opik = new Opik({ apiKey: import.meta.env.VITE_OPIK_API_KEY || '' });
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function evaluateVisionQuality(
  input: { userContext: any },
  output: string
): Promise<{ score: number; reasoning: string }> {
  const judgePrompt = `Evaluate this AI-generated vision (1-5 scale):

User Context: ${JSON.stringify(input.userContext).substring(0, 200)}
Generated Vision: ${output}

Rate on:
1. Specificity: References actual user context?
2. Inspiration: Motivating without being generic?
3. Identity-Focus: WHO they're becoming, not WHAT they're doing?

JSON response:
{
  "specificity": 1-5,
  "inspiration": 1-5,
  "identityFocus": 1-5,
  "reasoning": "brief explanation"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(judgePrompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '');
    const evaluation = JSON.parse(text);

    const avgScore = (
      evaluation.specificity +
      evaluation.inspiration +
      evaluation.identityFocus
    ) / 3;

    return { score: avgScore, reasoning: evaluation.reasoning };
  } catch (error) {
    return { score: 3, reasoning: 'Evaluation failed' };
  }
}

export async function evaluateJournalAnalysis(
  input: { entries: any[] },
  output: any
): Promise<{ score: number; reasoning: string }> {
  const judgePrompt = `Evaluate this journal analysis (1-5 scale):

Entry Count: ${input.entries.length}
Analysis: ${JSON.stringify(output)}

Rate on:
1. Relevance: Themes match actual entries?
2. Depth: Insights are meaningful?
3. Actionability: Suggestions are useful?

JSON response:
{
  "relevance": 1-5,
  "depth": 1-5,
  "actionability": 1-5,
  "reasoning": "brief explanation"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(judgePrompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '');
    const evaluation = JSON.parse(text);

    const avgScore = (
      evaluation.relevance +
      evaluation.depth +
      evaluation.actionability
    ) / 3;

    return { score: avgScore, reasoning: evaluation.reasoning };
  } catch (error) {
    return { score: 3, reasoning: 'Evaluation failed' };
  }
}

// Register evaluators with Opik
export function registerEvaluators() {
  opik.registerEvaluator('vision_quality', evaluateVisionQuality);
  opik.registerEvaluator('journal_analysis_quality', evaluateJournalAnalysis);
}
