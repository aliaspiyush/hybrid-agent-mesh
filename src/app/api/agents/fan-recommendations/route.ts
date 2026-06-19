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
    
    if (!body || !body.currentZone || !body.eventPhase || !body.queueData) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const safeZone = sanitizeInput(body.currentZone);
    const safePhase = sanitizeInput(body.eventPhase);

    const prompt = `You are a helpful stadium assistant.
Current Phase: ${safePhase}
Fan is currently in: ${safeZone}
Queue Wait Times (mins): Food: ${body.queueData.food || 0}, Restroom: ${body.queueData.restroom || 0}, Merch: ${body.queueData.merch || 0}
Crowd Level: ${body.crowdLevel || 'normal'}

Give a fan 2-3 short, friendly, specific recommendations based on current conditions. Use plain English. No bullet points, just comma-separated tips.`;

    const responseText = await generateContent(prompt);
    
    const tipsArray = responseText.split(',').map(tip => tip.trim()).filter(Boolean);

    return NextResponse.json({
      tips: tipsArray,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error /agents/fan-recommendations:', error);
    return NextResponse.json({ error: 'Failed to generate fan recommendations. Internal Server Error.' }, { status: 500 });
  }
}
