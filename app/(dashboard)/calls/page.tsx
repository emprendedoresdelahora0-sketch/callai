import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function CallsPage() {
  const session = await getSession();
  if (!session) return null;

  const calls = await prisma.call.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { prospect: true },
  });

  function sentimentBadge(s?: string | null) {
    if (s === "positive") return <span className="badge-green">Positivo</span>;
    if (s === "negative") return <span className="badge-red">Negativo</span>;
    return <span className="badge-gray">Neutro</span>;
  }

  function intentLabel(i?: string | null) {
    const map: Record<string, string> = {
      schedule_meeting: "📅 Reunión",
      get_info: "ℹ️ Información",
      complaint: "😠 Queja",
      not_interested: "🚫 No interesado",
      other: "💬 Otro",
    };
    return map[i || "other"] || "💬 Otro";
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Llamadas</h1>
        <p className="text-gray-400 mt-1">Historial completo de llamadas atendidas por tu IA</p>
      </div>

      {calls.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📞</div>
          <h3 className="text-white font-semibold text-lg mb-2">Aún no hay llamadas</h3>
          <p className="text-gray-400 text-sm">Configura tu webhook de Twilio para empezar a recibir llamadas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {calls.map((call) => (
            <div key={call.id} className="card hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="text-white font-semibold">{call.from}</span>
                    {sentimentBadge(call.sentiment)}
                    <span className="text-xs text-gray-500">{intentLabel(call.intent)}</span>
                    <span className="text-xs text-gray-500">· {call.duration}s · {new Date(call.createdAt).toLocaleString("es-MX")}</span>
                  </div>
                  {call.summary && (
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">{call.summary}</p>
                  )}
                  {call.prospect && (
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-gray-400">Prospecto:</span>
                      <span className="text-xs text-white">{call.prospect.name || call.prospect.phone}</span>
                      <span className={`text-xs font-bold ${call.prospect.score >= 60 ? "text-green-400" : call.prospect.score >= 30 ? "text-yellow-400" : "text-gray-400"}`}>
                        Score: {call.prospect.score}%
                      </span>
                      {call.prospect.budget && <span className="text-xs text-gray-400">Budget: {call.prospect.budget}</span>}
                    </div>
                  )}
                  {call.transcript && (
                    <details className="mt-3">
                      <summary className="text-brand-400 text-xs cursor-pointer hover:text-brand-300">
                        Ver transcripción completa
                      </summary>
                      <pre className="mt-2 text-gray-400 text-xs bg-gray-800 rounded-xl p-4 whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">
                        {call.transcript}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
