import { NextResponse } from 'next/server';
import { generateContent, sanitizeInput } from '@/lib/gemini';

// TODO: Implement actual rate limiting here (e.g. Upstash Redis, LRU Cache)
// RATE LIMITING PATTERN:
// const identifier = req.ip || 'anonymous';
// const { success } = await ratelimit.limit(identifier);
// if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body || !body.description || !body.zone || !body.severity) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const safeDescription = sanitizeInput(body.description);
    const safeZone = sanitizeInput(body.zone);
    const safeSeverity = sanitizeInput(body.severity);

    const prompt = `Classify this stadium incident and return a structured JSON ONLY, no markdown formatting.
Description: ${safeDescription}
Zone: ${safeZone}
Reported Severity: ${safeSeverity}

Return exact JSON format:
{
  "escalate": boolean,
  "suggestedAction": "string",
  "estimatedResolutionMins": number,
  "alertLevel": "green" | "amber" | "red"
}`;

    const responseText = await generateContent(prompt);
    
    let parsedData;
    try {
      // Remove any potential markdown blocks Gemini might add despite instructions
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.warn('Failed to parse Gemini JSON, falling back:', parseError);
      parsedData = {
        escalate: safeSeverity === 'high',
        suggestedAction: 'Dispatch staff immediately to assess situation.',
        estimatedResolutionMins: 15,
        alertLevel: safeSeverity === 'high' ? 'red' : 'amber'
      };
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('API Error /agents/incident-classify:', error);
    return NextResponse.json({ error: 'Failed to classify incident. Internal Server Error.' }, { status: 500 });
  }
}
