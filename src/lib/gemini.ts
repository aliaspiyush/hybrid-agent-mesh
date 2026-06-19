import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env';

// Initialize the Gemini client only once
let genAI: GoogleGenerativeAI | null = null;

if (env.NEXT_PUBLIC_AI_MODE === 'live' && env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

export async function generateContent(prompt: string, fallbackResponse: unknown = null): Promise<string> {
  if (env.NEXT_PUBLIC_AI_MODE !== 'live') {
    throw new Error('Attempted to call Gemini in non-live mode');
  }
  
  if (!genAI) {
    throw new Error('Gemini client is not initialized. Ensure GEMINI_API_KEY is set.');
  }

  try {
    // We use gemini-1.5-flash for speed as requested
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (fallbackResponse !== null) {
      // If we expect JSON, maybe fallbackResponse is a stringified JSON or we can just throw
      throw error;
    }
    throw error;
  }
}

/**
 * Basic sanitization to prevent prompt injection or strange characters
 * in user-provided inputs before passing to Gemini.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.replace(/[^\w\s.,!?'-]/g, '').trim();
}
