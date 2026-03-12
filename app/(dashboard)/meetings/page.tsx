import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function MeetingsPage() {
  const session = await getSession();
  if (!session) return null;

  const meetings = await prisma.meeting.findMany({
    where: { userId: session.userId },
    orderBy: { scheduledAt: "asc" },
    include: { prospect: true },
  });

  const upcoming = meetings.filter((m) => new Date(m.scheduledAt) >= new Date() && m.status === "scheduled");
  const past = meetings.filter((m) => new Date(m.scheduledAt) < new Date() || m.status !== "scheduled");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Reuniones</h1>
        <p className="text-gray-400 mt-1">Reuniones agendadas automáticamente por tu IA</p>
      </div>

      {meetings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-white font-semibold text-lg mb-2">Sin reuniones agendadas</h3>
          <p className="text-gray-400 text-sm">Tu IA agendará reuniones automáticamente cuando califique un prospecto</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-white font-semibold mb-4">Próximas ({upcoming.length})</h2>
              <div className="space-y-3">
                {upcoming.map((m) => (
                  <div key={m.id} className="card border-brand-500/20 hover:border-brand-500/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📅</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{m.title}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(m.scheduledAt).toLocaleString("es-MX")} · {m.duration} min
                        </p>
                        {m.prospect && (
                          <p className="text-brand-400 text-xs mt-0.5">
                            {m.prospect.name || m.prospect.phone}
                            {m.prospect.company && ` · ${m.prospect.company}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="badge-green">Agendada</span>
                        {m.calendarUrl && (
                          <a href={m.calendarUrl} target="_blank" rel="noopener noreferrer"
                            className="block text-xs text-brand-400 hover:text-brand-300 mt-1">
                            Ver en calendario →
                          </a>
                        )}
                      </div>
                    </div>
                    {m.notes && (
                      <p className="mt-3 pt-3 border-t border-gray-800 text-gray-400 text-sm">{m.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-white font-semibold mb-4 text-gray-400">Pasadas ({past.length})</h2>
              <div className="space-y-3">
                {past.map((m) => (
                  <div key={m.id} className="card opacity-60 hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-sm flex-shrink-0">📅</div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{m.title}</p>
                        <p className="text-gray-400 text-xs">{new Date(m.scheduledAt).toLocaleString("es-MX")} · {m.duration} min</p>
                        {m.prospect && <p className="text-gray-500 text-xs">{m.prospect.name || m.prospect.phone}</p>}
                      </div>
                      <span className={`text-xs ${m.status === "completed" ? "badge-green" : m.status === "canceled" ? "badge-red" : "badge-gray"}`}>
                        {m.status === "completed" ? "Completada" : m.status === "canceled" ? "Cancelada" : m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
