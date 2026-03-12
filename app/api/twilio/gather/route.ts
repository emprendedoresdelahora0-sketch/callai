import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processCallTurn, type ConversationTurn } from "@/lib/ai/assistant";

// This runs after the caller speaks — we send their words to Claude,
// generate an AI response, and return TwiML to speak it back.
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "";
  const callSid = searchParams.get("callSid") || "";
  const turn = parseInt(searchParams.get("turn") || "0");

  const body = await req.formData();
  const speechResult = body.get("SpeechResult")?.toString() || "";

  // Safety: max 10 turns to avoid infinite loops
  if (turn >= 10 || !speechResult.trim()) {
    await finalizeCall(callSid, userId, "Llamada finalizada por el sistema.");
    return twimlResponse(`
      <Response>
        <Say voice="Polly.Mia" language="es-MX">
          Muchas gracias por llamar. Que tengas excelente día. ¡Hasta luego!
        </Say>
        <Hangup/>
      </Response>
    `);
  }

  // Load settings & existing transcript
  const [settings, call] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { userId } }),
    prisma.call.findUnique({ where: { callSid } }),
  ]);

  // Parse existing conversation history from transcript field
  let history: ConversationTurn[] = [];
  if (call?.transcript) {
    try { history = JSON.parse(call.transcript); } catch { history = []; }
  }

  // Add this caller input to history
  history.push({ role: "user", content: speechResult });

  const context = {
    businessName: settings?.businessName || "nuestro negocio",
    assistantName: settings?.assistantName || "Aria",
    industry: settings?.industry || "general",
    workingHours: settings?.workingHours || "Lunes a Viernes 9am-6pm",
    calendarLink: settings?.calendarLink,
    qualifyBudget: settings?.qualifyBudget ?? true,
    qualifyTimeline: settings?.qualifyTimeline ?? true,
  };

  // ── Call Claude ──────────────────────────────────────────────────
  let aiResult;
  try {
    aiResult = await processCallTurn(speechResult, history.slice(0, -1), context);
  } catch (err) {
    console.error("Claude error:", err);
    // Fallback response if AI fails
    return twimlResponse(`
      <Response>
        <Gather
          input="speech"
          action="${gatherUrl(userId, callSid, turn + 1)}"
          method="POST"
          speechTimeout="3"
          language="es-MX"
          timeout="8"
        >
          <Say voice="Polly.Mia" language="es-MX">
            Disculpa, tuve un problema técnico. ¿Podrías repetir lo que me dijiste?
          </Say>
        </Gather>
        <Hangup/>
      </Response>
    `);
  }
  // ────────────────────────────────────────────────────────────────

  // Add AI reply to history
  history.push({ role: "assistant", content: aiResult.reply });

  // ── Save to database ─────────────────────────────────────────────
  await prisma.call.update({
    where: { callSid },
    data: {
      transcript: JSON.stringify(history),
      summary: aiResult.summary,
      sentiment: aiResult.sentiment,
      intent: aiResult.intent,
    },
  }).catch(console.error);

  // Upsert prospect data if we extracted anything useful
  const pd = aiResult.prospectData;
  const hasProspectData = pd.name || pd.email || pd.budget || pd.need || pd.score > 10;
  if (hasProspectData) {
    const from = call?.from || "unknown";
    const existingProspect = await prisma.prospect.findFirst({
      where: { callId: call?.id },
    });

    if (existingProspect) {
      await prisma.prospect.update({
        where: { id: existingProspect.id },
        data: {
          ...(pd.name && { name: pd.name }),
          ...(pd.email && { email: pd.email }),
          ...(pd.company && { company: pd.company }),
          ...(pd.budget && { budget: pd.budget }),
          ...(pd.timeline && { timeline: pd.timeline }),
          ...(pd.need && { need: pd.need }),
          score: pd.score,
          status: pd.score >= 60 ? "qualified" : pd.score >= 30 ? "new" : "unqualified",
        },
      }).catch(console.error);
    } else if (call?.id) {
      await prisma.prospect.create({
        data: {
          userId,
          callId: call.id,
          phone: from,
          name: pd.name,
          email: pd.email,
          company: pd.company,
          budget: pd.budget,
          timeline: pd.timeline,
          need: pd.need,
          score: pd.score,
          status: pd.score >= 60 ? "qualified" : pd.score >= 30 ? "new" : "unqualified",
        },
      }).catch(console.error);
    }
  }

  // Schedule a meeting if AI decided to
  if (aiResult.shouldScheduleMeeting && call?.id) {
    const prospect = await prisma.prospect.findFirst({ where: { callId: call.id } });
    const scheduledAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    await prisma.meeting.create({
      data: {
        userId,
        prospectId: prospect?.id,
        title: `Reunión con ${aiResult.prospectData.name || call?.from}`,
        scheduledAt,
        notes: aiResult.summary,
        calendarUrl: settings?.calendarLink || undefined,
      },
    }).catch(console.error);
  }
  // ────────────────────────────────────────────────────────────────

  // End call if AI decides or max turns reached
  if (aiResult.endCall) {
    await finalizeCall(callSid, userId, aiResult.summary);
    return twimlResponse(`
      <Response>
        <Say voice="Polly.Mia" language="es-MX">${escapeXml(aiResult.reply)}</Say>
        <Hangup/>
      </Response>
    `);
  }

  // Continue conversation
  return twimlResponse(`
    <Response>
      <Gather
        input="speech"
        action="${gatherUrl(userId, callSid, turn + 1)}"
        method="POST"
        speechTimeout="3"
        language="es-MX"
        speechModel="phone_call"
        timeout="10"
      >
        <Say voice="Polly.Mia" language="es-MX">${escapeXml(aiResult.reply)}</Say>
      </Gather>
      <Say voice="Polly.Mia" language="es-MX">
        No escuché tu respuesta. ¡Gracias por llamar, que tengas buen día!
      </Say>
      <Hangup/>
    </Response>
  `);
}

async function finalizeCall(callSid: string, userId: string, summary: string) {
  await prisma.call.update({
    where: { callSid },
    data: { status: "completed", summary },
  }).catch(console.error);
}

function gatherUrl(userId: string, callSid: string, turn: number) {
  return `/api/twilio/gather?userId=${userId}&callSid=${encodeURIComponent(callSid)}&turn=${turn}`;
}

function twimlResponse(xml: string) {
  return new NextResponse(xml.trim(), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
