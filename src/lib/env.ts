// Environment variable validation
// Ensures that required environment variables are present at build time

export function assertEnv() {
  const isLiveMode = process.env.NEXT_PUBLIC_AI_MODE === 'live';

  if (isLiveMode && !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required when NEXT_PUBLIC_AI_MODE is set to live.');
  }

  // Next.js exposes NEXT_PUBLIC_ variables automatically to the client
  if (!process.env.NEXT_PUBLIC_APP_URL && process.env.NODE_ENV === 'production') {
    console.warn('Warning: NEXT_PUBLIC_APP_URL is not set.');
  }
}

// Call this immediately to assert upon import
assertEnv();

export const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  NEXT_PUBLIC_AI_MODE: process.env.NEXT_PUBLIC_AI_MODE || 'mock',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
