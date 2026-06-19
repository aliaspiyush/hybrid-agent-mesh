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
    
    if (!body || !body.stands || !Array.isArray(body.stands) || !body.zone) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const safeZone = sanitizeInput(body.zone);
    const standsStr = body.stands.map((s: { name: string; waitMins: number; id: string }) => `${sanitizeInput(s.name)} (Wait: ${s.waitMins}m)`).join(', ');

    const prompt = `Given these concession stand wait times:
${standsStr}
Fan is in zone: ${safeZone}

Recommend the optimal stand for a fan in this zone. Return exact JSON format ONLY, no markdown:
{
  "recommended": "standId",
  "reason": "string",
  "estimatedWait": number
}`;

    const responseText = await generateContent(prompt);
    
    let parsedData;
    try {
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.warn('Failed to parse Gemini JSON, falling back:', parseError);
      // Fallback: just pick the shortest wait
      const bestStand = [...body.stands].sort((a, b) => a.waitMins - b.waitMins)[0];
      parsedData = {
        recommended: bestStand ? bestStand.id : 'unknown',
        reason: bestStand ? `Shortest wait time currently available (${bestStand.waitMins} mins)` : 'No stands available',
        estimatedWait: bestStand ? bestStand.waitMins : 0
      };
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('API Error /agents/queue-optimizer:', error);
    return NextResponse.json({ error: 'Failed to optimize queue. Internal Server Error.' }, { status: 500 });
  }
}
