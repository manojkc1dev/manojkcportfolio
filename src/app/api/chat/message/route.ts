import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { OWNER_PROFILE, SEO_CONFIG } from '@/lib/constants';

// Rate limit cache (in-memory per container lifecycle)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 20) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a minute before sending more messages.' },
        { status: 429 }
      );
    }

    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback when GEMINI_API_KEY is not yet configured in environment
      return NextResponse.json({
        reply: `Hi! I'm Manoj K.C.'s AI portfolio assistant. Manoj is a Python and Django Backend Developer based in Kathmandu, Nepal (graduated with a BIT degree in 2025). He specializes in Django REST Framework, PostgreSQL, JWT Authentication, and building high-performance APIs. Featured projects include CalcPro Calculator (multi-mode calculator suite) and Shabdhabhandar Dictionary (English-to-Nepali dictionary engine with custom Unicode search). You can reach him directly at ${OWNER_PROFILE.email} or WhatsApp at +977-9809807760!`,
        source: 'local_fallback',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build context
    const contextPrompt = `You are the AI assistant for Manoj K.C.'s personal portfolio and engineering showcase.
About Manoj K.C.:
- Title: Python and Django Backend Developer
- Location: Kathmandu, Nepal (UTC +5:45)
- Email: ${OWNER_PROFILE.email}
- WhatsApp: +977-9809807760
- Education: Bachelor of Information Technology (BIT), Mahendra Multiple Campus, Nepalgunj, Banke, Nepal (Graduated 2025)
- Core Expertise: Django, Django REST Framework (DRF), Python, PostgreSQL, REST APIs, JWT Authentication, FastAPI, SQLite
- Philosophy: "I care about code teammates can read, and APIs clients can integrate without a support call. Every endpoint I ship comes paired with Postman documentation and a strict README."
- Key Projects:
  1. CalcPro Calculator: Responsive multi-functional web calculator with Basic, Scientific, Programmer, and Financial modes. Built with safe mathematical evaluation.
  2. Shabdhabhandar Dictionary: Fast English-to-Nepali dictionary web app featuring custom fault-tolerant Unicode search logic, automated database ingestion (10,000+ words), and session-based history.

Rules:
1. Answer questions about Manoj's skills, projects, experience, availability, and background.
2. Be concise, friendly, and professional.
3. Speak in third person about Manoj.
4. If you do not know something specific, say so honestly and suggest contacting him via email (${OWNER_PROFILE.email}) or WhatsApp (+977-9809807760).
5. Never invent companies, projects, or credentials.
6. Strictly do not reference any unverified company branding.`;

    const userContent = history && Array.isArray(history) && history.length > 0
      ? `${contextPrompt}\n\nChat History:\n${history.map((h: { role: string; content: string }) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}\nUser: ${message}\nAssistant:`
      : `${contextPrompt}\n\nUser Question: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
    });

    const replyText = response.text || "I'm sorry, I couldn't generate a response. Please feel free to reach Manoj directly via email at manojkc1dev@gmail.com.";

    return NextResponse.json({ reply: replyText });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
