import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 backdrop-blur-sm bg-gray-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">CallAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-white transition-colors">Pricing</a>
            <a href="#niches"   className="hover:text-white transition-colors">Industries</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"    className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Login</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2.5">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-24 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            AI que responde llamadas 24/7
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Tu asistente de llamadas
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400"> con IA</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Responde llamadas, califica prospectos y agenda reuniones automáticamente.
            Funciona para cualquier negocio — las 24 horas, los 7 días.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-4">
              Empezar Prueba Gratis
            </Link>
            <a href="#demo" className="btn-secondary text-base px-8 py-4">
              Ver Demo
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">7 días gratis · Sin tarjeta de crédito · Cancela cuando quieras</p>
        </div>

        {/* ── Phone mockup ── */}
        <div className="mt-20 max-w-3xl mx-auto relative">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Aria · AI Assistant</p>
                <p className="text-gray-500 text-xs">Llamada entrante de +1 (555) 234-5678</p>
              </div>
              <div className="ml-auto badge-green">En vivo</div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { role: "ai",     text: "¡Hola! Gracias por llamar a Clínica Torres. Soy Aria, ¿en qué le puedo ayudar hoy?" },
                { role: "caller", text: "Hola, quisiera saber sobre sus tratamientos dentales y cuánto cuestan." },
                { role: "ai",     text: "Con gusto le informo. ¿Podría decirme su nombre y qué tratamiento específico le interesa?" },
                { role: "caller", text: "Me llamo Carlos. Me interesa blanqueamiento y posiblemente ortodoncia." },
                { role: "ai",     text: "Perfecto Carlos. Tenemos paquetes desde $800. ¿Le gustaría agendar una consulta gratuita esta semana?" },
              ].map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "ai" ? "" : "flex-row-reverse"}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${m.role === "ai" ? "bg-brand-500/20 text-brand-400" : "bg-gray-700 text-gray-300"}`}>
                    {m.role === "ai" ? "AI" : "C"}
                  </div>
                  <div className={`rounded-xl px-4 py-2.5 max-w-xs text-xs leading-relaxed ${m.role === "ai" ? "bg-brand-500/10 text-gray-200 border border-brand-500/20" : "bg-gray-800 text-gray-300"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-4 text-xs text-gray-500">
              <span className="badge-green">Prospecto: HOT 🔥</span>
              <span>Score: 85/100</span>
              <span>Reunión agendada</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Todo lo que necesitas</h2>
            <p className="text-gray-400 text-lg">Un sistema completo para nunca perder un cliente potencial</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📞",
                title: "Responde Llamadas 24/7",
                desc: "Tu IA atiende cada llamada — de noche, fin de semana o días festivos. No más llamadas perdidas.",
              },
              {
                icon: "🎯",
                title: "Califica Prospectos",
                desc: "El sistema BANT pregunta por presupuesto, autoridad, necesidad y tiempo automáticamente.",
              },
              {
                icon: "📅",
                title: "Agenda Reuniones",
                desc: "Conecta tu Google Calendar o Calendly y la IA agenda citas directo en la llamada.",
              },
              {
                icon: "🧠",
                title: "Transcripciones con IA",
                desc: "Cada llamada se transcribe y resume automáticamente. Revisa lo importante en segundos.",
              },
              {
                icon: "📊",
                title: "CRM Integrado",
                desc: "Todos tus prospectos organizados con score, notas e historial de llamadas en un solo lugar.",
              },
              {
                icon: "🔧",
                title: "Configurable por Nicho",
                desc: "Clínicas, inmobiliarias, agencias, restaurants, abogados — personaliza el guion al 100%.",
              },
            ].map((f) => (
              <div key={f.title} className="card hover:border-brand-500/30 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section id="niches" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Funciona para cualquier industria</h2>
          <p className="text-gray-400 mb-12">Configura el guion de tu IA según tu negocio</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "🏥 Clínicas & Salud","🏠 Bienes Raíces","⚖️ Abogados","🔧 Servicios del Hogar",
              "🍽️ Restaurantes","💆 Spas & Belleza","🎓 Educación","🚗 Autoservicio",
              "💼 Consultoría","🛒 E-commerce","💰 Finanzas","🏋️ Gimnasios",
            ].map((n) => (
              <span key={n} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm hover:border-brand-500/50 transition-colors cursor-default">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Un precio simple</h2>
          <p className="text-gray-400 mb-12">Sin planes confusos. Todo incluido.</p>
          <div className="card border-brand-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              MÁS POPULAR
            </div>
            <div className="mt-2">
              <div className="text-6xl font-bold text-white mb-1">
                $29<span className="text-2xl font-normal text-gray-400">/mes</span>
              </div>
              <p className="text-gray-400 mb-8">Todo incluido · Sin sorpresas</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8 text-left">
                {[
                  "✅ Llamadas ilimitadas (hasta 500/mes)",
                  "✅ IA con Claude Opus (la más avanzada)",
                  "✅ CRM de prospectos integrado",
                  "✅ Agenda automática de reuniones",
                  "✅ Transcripciones y resúmenes",
                  "✅ Número de teléfono Twilio incluido*",
                  "✅ Dashboard con analíticas",
                  "✅ Soporte por email",
                  "✅ 7 días de prueba gratis",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">{item}</li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary w-full block text-center text-base py-4">
                Empezar Prueba Gratis →
              </Link>
              <p className="text-xs text-gray-500 mt-3">*Número Twilio tiene costo adicional de ~$1/mes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-10 px-6 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="text-white font-semibold">CallAI</span>
        </div>
        <p>© 2024 CallAI. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
