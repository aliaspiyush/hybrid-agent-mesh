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
    
    // Validate input
    if (!body || !body.zoneId || typeof body.density !== 'number' || typeof body.capacityPercent !== 'number') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { zoneId, density, capacityPercent, adjacentZones = [] } = body;
    
    // Sanitize zoneId
    const safeZoneId = sanitizeInput(zoneId);

    const prompt = `You are a stadium operations AI. 
Current Zone: ${safeZoneId}
Density: ${density} people
Capacity: ${capacityPercent}%
Adjacent Zones: ${adjacentZones.map(sanitizeInput).join(', ')}

Generate a 1-sentence proactive crowd routing recommendation for stadium ops staff. Be direct and actionable. No markdown.`;

    const responseText = await generateContent(prompt);
    
    // Simple confidence heuristic based on capacity
    const confidence = capacityPercent > 85 ? 'high' : capacityPercent > 60 ? 'medium' : 'low';

    return NextResponse.json({
      recommendation: responseText.trim(),
      confidence,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('API Error /agents/crowd-flow:', error);
    // Never expose raw errors to the client
    return NextResponse.json({ error: 'Failed to generate recommendation. Internal Server Error.' }, { status: 500 });
  }
}
