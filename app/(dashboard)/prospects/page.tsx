import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const statusColors: Record<string, string> = {
  new: "badge-blue",
  qualified: "badge-green",
  unqualified: "badge-gray",
  converted: "badge-green",
  lost: "badge-red",
};

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  qualified: "Calificado",
  unqualified: "No calificado",
  converted: "Convertido",
  lost: "Perdido",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 60 ? "bg-green-500" : score >= 30 ? "bg-yellow-500" : "bg-gray-600";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${score >= 60 ? "text-green-400" : score >= 30 ? "text-yellow-400" : "text-gray-400"}`}>
        {score}
      </span>
    </div>
  );
}

export default async function ProspectsPage() {
  const session = await getSession();
  if (!session) return null;

  const prospects = await prisma.prospect.findMany({
    where: { userId: session.userId },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    include: { call: true, meetings: true },
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Prospectos</h1>
          <p className="text-gray-400 mt-1">{prospects.length} prospectos en total</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2 text-xs">
            <span className="badge-green">{prospects.filter(p => p.score >= 60).length} Hot</span>
            <span className="badge-yellow">{prospects.filter(p => p.score >= 30 && p.score < 60).length} Warm</span>
            <span className="badge-gray">{prospects.filter(p => p.score < 30).length} Cold</span>
          </div>
        </div>
      </div>

      {prospects.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-white font-semibold text-lg mb-2">Aún no hay prospectos</h3>
          <p className="text-gray-400 text-sm">Los prospectos se crean automáticamente cuando tu IA atiende llamadas</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-800">
              <tr>
                {["Prospecto", "Contacto", "Necesidad", "Presupuesto", "Score", "Estado", "Fecha"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {prospects.map((p) => (
                <tr key={p.id} className="bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-white font-medium text-sm">{p.name || "Sin nombre"}</p>
                      {p.company && <p className="text-gray-400 text-xs">{p.company}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-300 text-sm">{p.phone}</p>
                    {p.email && <p className="text-gray-500 text-xs">{p.email}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-300 text-sm max-w-[200px] truncate">{p.need || "—"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-300 text-sm">{p.budget || "—"}</p>
                    {p.timeline && <p className="text-gray-500 text-xs">{p.timeline}</p>}
                  </td>
                  <td className="px-4 py-4 w-28">
                    <ScoreBar score={p.score} />
                  </td>
                  <td className="px-4 py-4">
                    <span className={statusColors[p.status] || "badge-gray"}>
                      {statusLabels[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString("es-MX")}</p>
                    {p.meetings.length > 0 && (
                      <p className="text-brand-400 text-xs">{p.meetings.length} reunión(es)</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
