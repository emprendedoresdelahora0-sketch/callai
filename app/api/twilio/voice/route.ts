import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Twilio calls this when someone dials the business phone number.
// We respond with TwiML to play a greeting and gather speech.
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return twimlResponse(`
      <Response>
        <Say voice="alice" language="es-MX">
          Lo sentimos, este número no está configurado correctamente.
        </Say>
        <Hangup/>
      </Response>
    `);
  }

  // Load business settings
  const settings = await prisma.businessSettings.findUnique({
    where: { userId },
  });

  const body = await req.formData();
  const from = body.get("From")?.toString() || "unknown";
  const callSid = body.get("CallSid")?.toString() || `manual-${Date.now()}`;

  // Create initial call record
  await prisma.call.upsert({
    where: { callSid },
    create: {
      callSid,
      userId,
      from,
      to: body.get("To")?.toString() || "",
      status: "in_progress",
    },
    update: {},
  }).catch(() => null); // ignore unique constraint errors

  const greeting = settings?.greeting ||
    `Hola, gracias por llamar a ${settings?.businessName || "nuestro negocio"}. Soy ${settings?.assistantName || "Aria"}, tu asistente virtual. ¿En qué puedo ayudarte hoy?`;

  const gatherUrl = `/api/twilio/gather?userId=${userId}&callSid=${encodeURIComponent(callSid)}&turn=0`;

  return twimlResponse(`
    <Response>
      <Gather
        input="speech"
        action="${gatherUrl}"
        method="POST"
        speechTimeout="3"
        language="es-MX"
        speechModel="phone_call"
        timeout="8"
      >
        <Say voice="Polly.Mia" language="es-MX">${escapeXml(greeting)}</Say>
      </Gather>
      <Say voice="Polly.Mia" language="es-MX">
        Parece que no recibí tu respuesta. Por favor llama de nuevo. ¡Que tengas buen día!
      </Say>
      <Hangup/>
    </Response>
  `);
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
