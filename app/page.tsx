import Link from "next/link";

const CYAN = "#00D4F5";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050a0e" }}>

      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: "rgba(5,10,14,0.85)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-black text-lg" style={{ backgroundColor: CYAN }}>N</div>
            <div>
              <span className="text-white font-black text-lg tracking-tight">NOVA</span>
              <span className="text-xs text-gray-500 block -mt-0.5 leading-none">by Vantage AI Systems</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precio</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Iniciar sesión</Link>
            <Link href="/register" className="btn-primary text-sm px-5 py-2.5">Prueba Gratis →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: "rgba(0,212,245,0.07)" }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-8 border" style={{ backgroundColor: "rgba(0,212,245,0.08)", borderColor: "rgba(0,212,245,0.2)", color: CYAN }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: CYAN }} />
            Sistema activo 24/7 · Sin operadores humanos
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight uppercase tracking-tight">
            CADA LLAMADA QUE<br />
            <span style={{ color: CYAN }}>NO CONTESTAS</span><br />
            SE VA CON LA COMPETENCIA.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            NOVA responde, califica y da seguimiento a tus llamadas en segundos —
            para que tu negocio nunca pierda una oportunidad por falta de respuesta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg px-10 py-4 font-black">EMPEZAR PRUEBA GRATIS →</Link>
            <a href="#como-funciona" className="btn-secondary text-base px-8 py-4">Ver cómo funciona</a>
          </div>
          <p className="text-sm text-gray-600 mt-4">7 días gratis · Sin tarjeta de crédito · Cancela cuando quieras</p>
        </div>

        {/* Live call mockup */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="rounded-2xl p-6 text-left border" style={{ backgroundColor: "#0d1a21", borderColor: "#1a3040" }}>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: "#1a3040" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black text-lg" style={{ backgroundColor: CYAN }}>N</div>
              <div>
                <p className="text-white font-bold text-sm">NOVA · Asistente de Llamadas</p>
                <p className="text-gray-500 text-xs">Llamada entrante · +52 (55) 1234-5678</p>
              </div>
              <div className="ml-auto badge-cyan">● En vivo</div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { role: "ai",     text: "¡Hola! Gracias por llamar a Clínica Torres. Soy NOVA. ¿En qué puedo ayudarte hoy?" },
                { role: "caller", text: "Hola, quería información sobre tratamientos dentales y precios." },
                { role: "ai",     text: "Con gusto. ¿Me dices tu nombre y qué tratamiento te interesa?" },
                { role: "caller", text: "Soy Carlos. Me interesa blanqueamiento y ortodoncia." },
                { role: "ai",     text: "Perfecto Carlos. Tenemos paquetes desde $800. ¿Agendamos una consulta gratuita esta semana?" },
              ].map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "ai" ? "" : "flex-row-reverse"}`}>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                    style={m.role === "ai" ? { backgroundColor: "rgba(0,212,245,0.15)", color: CYAN } : { backgroundColor: "#1a3040", color: "#9ca3af" }}>
                    {m.role === "ai" ? "N" : "C"}
                  </div>
                  <div className="rounded-xl px-4 py-2.5 max-w-xs text-xs leading-relaxed"
                    style={m.role === "ai"
                      ? { backgroundColor: "rgba(0,212,245,0.07)", color: "#e2e8f0", border: "1px solid rgba(0,212,245,0.15)" }
                      : { backgroundColor: "#1a3040", color: "#d1d5db" }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-4 text-xs text-gray-500" style={{ borderColor: "#1a3040" }}>
              <span className="badge-cyan">Prospecto HOT 🔥</span>
              <span>Score: 88/100</span>
              <span>✅ Reunión agendada</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-6 border-y" style={{ borderColor: "#1a3040" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-4 uppercase">
            MIENTRAS LEES ESTO, UNA LLAMADA<br />
            <span style={{ color: CYAN }}>YA SE FUE CON TU COMPETENCIA.</span>
          </h2>
          <p className="text-center text-gray-400 mb-14 text-lg max-w-2xl mx-auto">
            No es falta de esfuerzo. Es que ningún equipo humano puede responder con la misma velocidad, constancia y precisión las 24 horas del día. Por eso existe NOVA.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "⏱", title: "RESPUESTA LENTA", desc: "Cada minuto que pasa sin responder, la intención de compra se enfría y la oportunidad se va." },
              { icon: "🔁", title: "SEGUIMIENTO INCONSISTENTE", desc: "Muchos prospectos no compran en el primer contacto. Se pierden porque nadie les da seguimiento con velocidad y constancia." },
              { icon: "💸", title: "DINERO QUE NUNCA VES", desc: "Cada llamada no respondida, ni calificada ni olvidada es dinero que termina en otro negocio." },
            ].map((p) => (
              <div key={p.title} className="card">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm uppercase tracking-widest mb-4" style={{ color: CYAN }}>Sistema NOVA</p>
          <h2 className="text-4xl font-black text-white text-center mb-4 uppercase">
            NO ES UN CHATBOT.<br /><span style={{ color: CYAN }}>ES UN SISTEMA DE VENTAS QUE NUNCA DUERME.</span>
          </h2>
          <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">Responde con velocidad, califica con precisión, da seguimiento sin fallar.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "RESPONDE EN SEGUNDOS", desc: "NOVA atiende cada llamada con velocidad inmediata para que nunca pierdas una oportunidad importante." },
              { icon: "🎯", title: "CALIFICA AUTOMÁTICAMENTE", desc: "Filtra, organiza y detecta cuáles prospectos están listos para avanzar. Tu equipo solo cierra." },
              { icon: "🔄", title: "SEGUIMIENTO SIN FALLAR", desc: "Mensajes, recordatorios y continuidad comercial sin depender de memoria humana ni procesos manuales." },
              { icon: "📋", title: "TRANSCRIPCIONES CON IA", desc: "Cada llamada se transcribe y resume automáticamente. Revisa lo importante en segundos." },
              { icon: "📊", title: "CRM INTEGRADO", desc: "Todos tus prospectos con score, notas e historial de llamadas en un solo panel." },
              { icon: "🔧", title: "CONFIGURABLE POR NICHO", desc: "Clínicas, inmobiliarias, abogados, gimnasios — personaliza NOVA a tu industria en minutos." },
            ].map((f) => (
              <div key={f.title} className="card hover:border-[#00D4F5]/30 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{f.desc}</p>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: CYAN }}>Incluido en NOVA</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 px-6" style={{ backgroundColor: "#080f14" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: CYAN }}>Sin teoría. Mira cómo funciona.</p>
          <h2 className="text-4xl font-black text-white mb-14 uppercase">
            ASÍ FUNCIONA NOVA<br /><span style={{ color: CYAN }}>CUANDO ENTRA UNA LLAMADA REAL.</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-left">
            {[
              { num: "01", title: "Llamada entrante", desc: "Tu cliente llama. NOVA responde al instante, sin espera, sin importar la hora." },
              { num: "02", title: "NOVA califica", desc: "Hace las preguntas correctas: necesidad, presupuesto, urgencia, contacto." },
              { num: "03", title: "Score automático", desc: "Cada prospecto recibe un puntaje 0-100. Tú solo atienes a los calientes." },
              { num: "04", title: "Reunión agendada", desc: "Si califica, NOVA agenda la cita directo en tu calendario. Sin fricción." },
            ].map((s) => (
              <div key={s.num} className="card">
                <div className="text-4xl font-black mb-3 opacity-30" style={{ color: CYAN }}>{s.num}</div>
                <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-white text-center mb-14 uppercase">
            LA DIFERENCIA ENTRE RESPONDER MANUALMENTE...<br />
            <span style={{ color: CYAN }}>Y TENER UN SISTEMA QUE NUNCA SE DETIENE.</span>
          </h2>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#1a3040" }}>
                  <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide">MÉTRICA</th>
                  <th className="p-4 text-gray-500 font-medium text-center text-xs uppercase tracking-wide">Operación Manual</th>
                  <th className="p-4 font-black text-center text-xs uppercase tracking-wide" style={{ color: CYAN }}>SISTEMA NOVA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Velocidad de respuesta", "❌ Variable", "✅ Instantánea"],
                  ["Disponibilidad", "❌ Limitada por horario", "✅ 24/7"],
                  ["Seguimiento", "❌ Solo si alguien recuerda", "✅ Automático"],
                  ["Capacidad de respuesta", "❌ Limitada por equipo", "✅ Escalable"],
                  ["Dependencia humana", "❌ Alta", "✅ Baja"],
                ].map(([metric, manual, nova], i) => (
                  <tr key={i} className={`border-b ${i % 2 === 0 ? "" : "bg-[#080f14]/50"}`} style={{ borderColor: "#1a3040" }}>
                    <td className="p-4 text-gray-300 font-medium">{metric}</td>
                    <td className="p-4 text-center text-red-400 text-sm">{manual}</td>
                    <td className="p-4 text-center font-bold text-sm" style={{ color: CYAN }}>{nova}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6" style={{ backgroundColor: "#080f14" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4 uppercase">
            NOVA ESTÁ DISEÑADO PARA NEGOCIOS<br /><span style={{ color: CYAN }}>DONDE CADA LLAMADA CUENTA.</span>
          </h2>
          <p className="text-gray-400 mb-12">Configura el guion de NOVA según tu industria en minutos.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "🏥 Clínicas & Salud","🏠 Bienes Raíces","⚖️ Despachos Legales","🔧 Servicios del Hogar",
              "🍽️ Restaurantes","💆 Spas & Estética","🎓 Educación","🚗 Automotriz",
              "💼 Consultoría","🛒 E-commerce","💰 Finanzas","🏋️ Gimnasios",
            ].map((n) => (
              <span key={n} className="text-gray-300 px-4 py-2 rounded-full text-sm border transition-colors"
                style={{ backgroundColor: "#0d1a21", borderColor: "#1a3040" }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: CYAN }}>Precio simple</p>
          <h2 className="text-4xl font-black text-white mb-4 uppercase">UN SOLO PLAN.<br />TODO INCLUIDO.</h2>
          <p className="text-gray-400 mb-12">Sin cobros ocultos. Sin planes confusos. Activa y empieza a ganar.</p>
          <div className="card relative" style={{ borderColor: "rgba(0,212,245,0.3)" }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide" style={{ backgroundColor: CYAN }}>
              MÁS POPULAR
            </div>
            <div className="mt-4">
              <div className="text-7xl font-black text-white mb-1">
                $29<span className="text-3xl font-normal text-gray-500">/mes</span>
              </div>
              <p className="text-gray-500 mb-8">Todo incluido · Sin sorpresas</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8 text-left">
                {[
                  "✅ Llamadas ilimitadas (hasta 500/mes)",
                  "✅ IA con Claude Opus (la más avanzada del mercado)",
                  "✅ CRM de prospectos integrado",
                  "✅ Agenda automática de reuniones",
                  "✅ Transcripciones y resúmenes de cada llamada",
                  "✅ Dashboard con analíticas en tiempo real",
                  "✅ Configurable para cualquier industria",
                  "✅ 7 días de prueba gratis",
                ].map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href="/register" className="btn-primary w-full text-lg py-4 font-black">
                ACTIVAR NOVA GRATIS →
              </Link>
              <p className="text-xs text-gray-600 mt-3">*Número Twilio con costo adicional de ~$1/mes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6 text-center text-gray-600 text-sm" style={{ borderColor: "#1a3040" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-sm" style={{ backgroundColor: CYAN }}>N</div>
          <span className="text-white font-black">NOVA</span>
          <span className="text-gray-600">by Vantage AI Systems</span>
        </div>
        <p>© {new Date().getFullYear()} Vantage AI Systems. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
