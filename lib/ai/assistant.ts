import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface BusinessContext {
  businessName: string;
  assistantName: string;
  industry: string;
  workingHours: string;
  calendarLink?: string | null;
  qualifyBudget: boolean;
  qualifyTimeline: boolean;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AICallResponse {
  reply: string;           // Text to speak back to caller
  intent: string;          // schedule_meeting | get_info | complaint | not_interested | other
  prospectData: {
    name?: string;
    email?: string;
    company?: string;
    budget?: string;
    timeline?: string;
    need?: string;
    score: number;         // 0-100 lead score
  };
  shouldScheduleMeeting: boolean;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  endCall: boolean;
}

export async function processCallTurn(
  callerInput: string,
  conversationHistory: ConversationTurn[],
  context: BusinessContext
): Promise<AICallResponse> {
  const systemPrompt = buildSystemPrompt(context);

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((turn) => ({
      role: turn.role as "user" | "assistant",
      content: turn.content,
    })),
    { role: "user", content: callerInput },
  ];

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    tools: [
      {
        name: "handle_call_response",
        description:
          "Generate a structured response for the phone call. Always use this tool.",
        input_schema: {
          type: "object" as const,
          properties: {
            reply: {
              type: "string",
              description:
                "What to say to the caller. Keep it conversational and under 3 sentences.",
            },
            intent: {
              type: "string",
              enum: [
                "schedule_meeting",
                "get_info",
                "complaint",
                "not_interested",
                "other",
              ],
              description: "Detected intent of the caller",
            },
            prospectData: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                company: { type: "string" },
                budget: { type: "string" },
                timeline: { type: "string" },
                need: { type: "string" },
                score: {
                  type: "number",
                  description:
                    "Lead qualification score 0-100. Score based on budget fit, urgency, need clarity, and engagement.",
                },
              },
              required: ["score"],
            },
            shouldScheduleMeeting: {
              type: "boolean",
              description:
                "Whether to offer or confirm a meeting with this caller",
            },
            summary: {
              type: "string",
              description:
                "Brief summary of what was discussed (1-2 sentences)",
            },
            sentiment: {
              type: "string",
              enum: ["positive", "neutral", "negative"],
            },
            endCall: {
              type: "boolean",
              description:
                "Whether the call should end after this response (caller said goodbye, satisfied, etc.)",
            },
          },
          required: [
            "reply",
            "intent",
            "prospectData",
            "shouldScheduleMeeting",
            "summary",
            "sentiment",
            "endCall",
          ],
        },
      },
    ],
    tool_choice: { type: "tool", name: "handle_call_response" },
    messages,
  });

  // Extract tool use result
  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    // Fallback
    return {
      reply: "Thank you for calling. How can I assist you today?",
      intent: "other",
      prospectData: { score: 0 },
      shouldScheduleMeeting: false,
      summary: "Call with no extractable data.",
      sentiment: "neutral",
      endCall: false,
    };
  }

  return toolUse.input as AICallResponse;
}

export async function generateCallSummary(
  transcript: string,
  context: BusinessContext
): Promise<{ summary: string; sentiment: string; intent: string }> {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Summarize this call transcript for ${context.businessName} in 2-3 sentences. Extract sentiment and intent.

Transcript:
${transcript}

Respond in JSON: {"summary": "...", "sentiment": "positive|neutral|negative", "intent": "schedule_meeting|get_info|complaint|not_interested|other"}`,
      },
    ],
  });

  try {
    const text = response.content.find((b) => b.type === "text");
    if (text && text.type === "text") {
      return JSON.parse(text.text);
    }
  } catch {
    // fallback
  }
  return { summary: transcript.slice(0, 200), sentiment: "neutral", intent: "other" };
}

function buildSystemPrompt(ctx: BusinessContext): string {
  return `You are ${ctx.assistantName}, an AI phone assistant for ${ctx.businessName} (${ctx.industry} industry).

Your job:
1. Answer calls professionally and warmly
2. Understand why the caller is calling
3. Qualify leads (if applicable) by naturally asking about:
   ${ctx.qualifyBudget ? "- Budget or investment range" : ""}
   ${ctx.qualifyTimeline ? "- Timeline or urgency" : ""}
   - Their specific need or problem
   - Contact information (name, email)
4. Schedule meetings when appropriate${ctx.calendarLink ? ` using this link: ${ctx.calendarLink}` : ""}
5. Handle complaints with empathy and escalation paths
6. Business hours: ${ctx.workingHours}

IMPORTANT RULES:
- Keep responses SHORT (2-3 sentences max — this is a phone call)
- Sound human and natural, NOT robotic
- Never lie or make promises you can't keep
- If unsure, say you'll have someone follow up
- Always try to get name + contact info
- Lead score guide: 0-30=cold, 31-60=warm, 61-100=hot
  - Hot: clear need + budget + urgent timeline + engaged
  - Warm: some criteria met
  - Cold: browsing, no budget, wrong fit

Always use the handle_call_response tool to structure your response.`;
}
