import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [user, callsCount, prospectsCount, meetingsCount, recentCalls, hotProspects] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: session.userId }, include: { subscription: true } }),
      prisma.call.count({ where: { userId: session.userId } }),
      prisma.prospect.count({ where: { userId: session.userId } }),
      prisma.meeting.count({ where: { userId: session.userId, status: "scheduled" } }),
      prisma.call.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.prospect.findMany({
        where: { userId: session.userId, score: { gte: 60 } },
        orderBy: { score: "desc" },
        take: 5,
      }),
    ]);

  const isActive = user?.subscription?.status === "active" || user?.subscription?.status === "trial";

  const stats = [
    { label: "Total Llamadas",    value: callsCount,     icon: "📞", color: "text-blue-400" },
    { label: "Prospectos",        value: prospectsCount,  icon: "🎯", color: "text-green-400" },
    { label: "Reuniones Agendadas", value: meetingsCount, icon: "📅", color: "text-purple-400" },
    { label: "Score Promedio",    value: hotProspects.length > 0 ? Math.round(hotProspects.reduce((a, p) => a + p.score, 0) / hotProspects.length) + "%" : "—", icon: "🔥", color: "text-orange-400" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hola, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Aquí está el resumen de tu asistente de llamadas</p>
        </div>
        {!isActive && (
          <Link href="/settings" className="btn-primary text-sm">
            Activar Suscripción →
          </Link>
        )}
      </div>

      {/* Trial/subscription banner */}
      {!isActive && (
        <div className="bg-brand-500/10 border border-brand-500/30 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-brand-300 font-semibold">Estás en periodo de prueba gratuito</p>
            <p className="text-gray-400 text-sm">Activa tu suscripción por $29/mes para recibir llamadas reales.</p>
          </div>
          <Link href="/settings" className="btn-primary text-sm flex-shrink-0">
            Activar $29/mes
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Setup instructions if no calls yet */}
      {callsCount === 0 && (
        <div className="card mb-8 border-dashed border-gray-700">
          <h2 className="text-white font-semibold text-lg mb-4">🚀 Configura tu asistente en 3 pasos</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Configura tu negocio", desc: "Ve a Ajustes y personaliza el nombre, industria y guion de tu IA.", href: "/settings", cta: "Ir a Ajustes" },
              { step: "2", title: "Configura Twilio", desc: "Obtén un número de teléfono en Twilio y apunta el webhook a tu URL.", href: "https://twilio.com/console", cta: "Abrir Twilio" },
              { step: "3", title: "Activa la suscripción", desc: "Paga $29/mes para activar tu asistente de IA en producción.", href: "/settings", cta: "Suscribirme" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 p-4 bg-gray-800 rounded-xl">
                <div className="w-8 h-8 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{s.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.desc}</p>
                </div>
                <a href={s.href} className="text-brand-400 text-xs font-medium hover:text-brand-300 flex-shrink-0">
                  {s.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Últimas Llamadas</h2>
            <Link href="/calls" className="text-brand-400 text-sm hover:text-brand-300">Ver todas →</Link>
          </div>
          {recentCalls.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Aún no hay llamadas registradas</p>
          ) : (
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                    📞
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{call.from}</p>
                    <p className="text-gray-400 text-xs">{new Date(call.createdAt).toLocaleDateString("es-MX")} · {call.duration}s</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${call.sentiment === "positive" ? "badge-green" : call.sentiment === "negative" ? "badge-red" : "badge-gray"}`}>
                    {call.intent || "llamada"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hot Prospects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Prospectos Calientes 🔥</h2>
            <Link href="/prospects" className="text-brand-400 text-sm hover:text-brand-300">Ver todos →</Link>
          </div>
          {hotProspects.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Aún no hay prospectos calificados</p>
          ) : (
            <div className="space-y-3">
              {hotProspects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm">
                    🎯
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.name || p.phone}</p>
                    <p className="text-gray-400 text-xs truncate">{p.need || "Sin detalles"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm">{p.score}%</div>
                    <span className={`text-xs ${p.status === "qualified" ? "badge-green" : p.status === "converted" ? "badge-blue" : "badge-yellow"}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Webhook URL */}
      <div className="mt-6 card border-gray-700">
        <h3 className="text-white font-semibold mb-2">🔗 Tu URL de Webhook (Twilio)</h3>
        <p className="text-gray-400 text-sm mb-3">Configura esta URL en tu número de Twilio como webhook de llamadas entrantes:</p>
        <div className="bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-brand-300 flex items-center justify-between">
          <span>{`${process.env.APP_URL || "https://tu-dominio.com"}/api/twilio/voice?userId=${session.userId}`}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Método: HTTP POST · Twilio Console → Phone Numbers → Configure</p>
      </div>
    </div>
  );
}
