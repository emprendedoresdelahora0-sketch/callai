"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Settings {
  businessName: string;
  assistantName: string;
  greeting: string;
  industry: string;
  workingHours: string;
  timezone: string;
  qualifyBudget: boolean;
  qualifyTimeline: boolean;
  calendarLink: string;
  afterHoursMsg: string;
}

interface SubscriptionInfo {
  status: string;
  currentPeriodEnd?: string;
}

const INDUSTRIES = [
  "general", "clinica_salud", "bienes_raices", "legal", "restaurante",
  "spa_belleza", "educacion", "automotriz", "consultoria", "finanzas",
  "gimnasio", "ecommerce",
];

const INDUSTRY_LABELS: Record<string, string> = {
  general: "General", clinica_salud: "Clínica / Salud", bienes_raices: "Bienes Raíces",
  legal: "Servicios Legales", restaurante: "Restaurante", spa_belleza: "Spa / Belleza",
  educacion: "Educación", automotriz: "Automotriz", consultoria: "Consultoría",
  finanzas: "Finanzas", gimnasio: "Gimnasio / Fitness", ecommerce: "E-commerce",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    businessName: "", assistantName: "Aria", greeting: "", industry: "general",
    workingHours: "Monday-Friday 9am-6pm", timezone: "America/Mexico_City",
    qualifyBudget: true, qualifyTimeline: true, calendarLink: "", afterHoursMsg: "",
  });
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data) => {
      if (data.settings) setSettings(data.settings);
      if (data.subscription) setSubscription(data.subscription);
      if (data.userId) setUserId(data.userId);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSubscribe() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400 mt-1">Personaliza tu asistente de IA</p>
      </div>

      {/* Subscription Status */}
      <div className="card mb-6">
        <h2 className="text-white font-semibold mb-4">Suscripción</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={subscription?.status === "active" ? "badge-green" : subscription?.status === "trial" ? "badge-blue" : "badge-red"}>
                {subscription?.status === "active" ? "Activo" : subscription?.status === "trial" ? "Prueba Gratis" : "Inactivo"}
              </span>
              <span className="text-gray-400 text-sm">Plan Starter · $29/mes</span>
            </div>
            {subscription?.currentPeriodEnd && (
              <p className="text-gray-500 text-xs">
                Próximo cobro: {new Date(subscription.currentPeriodEnd).toLocaleDateString("es-MX")}
              </p>
            )}
            {subscription?.status !== "active" && (
              <p className="text-gray-400 text-sm mt-1">Activa tu plan para recibir llamadas reales con IA</p>
            )}
          </div>
          {subscription?.status !== "active" && (
            <button onClick={handleSubscribe} className="btn-primary text-sm">
              Suscribirme $29/mes →
            </button>
          )}
        </div>
      </div>

      {/* Webhook URL */}
      <div className="card mb-6 border-gray-700">
        <h2 className="text-white font-semibold mb-2">URL de Webhook para Twilio</h2>
        <p className="text-gray-400 text-sm mb-3">
          Ve a{" "}
          <a href="https://twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
            Twilio Console
          </a>{" "}
          → Phone Numbers → tu número → Voice Configuration y pega esta URL:
        </p>
        <div className="bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-brand-300">
          {typeof window !== "undefined" ? `${window.location.origin}/api/twilio/voice?userId=${userId}` : `/api/twilio/voice?userId=${userId}`}
        </div>
        <p className="text-xs text-gray-500 mt-2">Método: HTTP POST · Voice webhook</p>
      </div>

      {/* Business Settings Form */}
      <form onSubmit={handleSave} className="card space-y-5">
        <h2 className="text-white font-semibold">Configuración del Negocio</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre del Negocio</label>
            <input className="input" value={settings.businessName} placeholder="Mi Empresa S.A."
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre del Asistente</label>
            <input className="input" value={settings.assistantName} placeholder="Aria"
              onChange={(e) => setSettings({ ...settings, assistantName: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Industria</label>
          <select className="input" value={settings.industry}
            onChange={(e) => setSettings({ ...settings, industry: e.target.value })}>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{INDUSTRY_LABELS[i] || i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Saludo inicial</label>
          <textarea className="input resize-none h-20" value={settings.greeting}
            placeholder="¡Hola! Gracias por llamar a [Tu Negocio]. Soy Aria, ¿en qué le puedo ayudar?"
            onChange={(e) => setSettings({ ...settings, greeting: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Mensaje fuera de horario</label>
          <textarea className="input resize-none h-20" value={settings.afterHoursMsg}
            placeholder="Actualmente estamos cerrados. Nuestro horario es..."
            onChange={(e) => setSettings({ ...settings, afterHoursMsg: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Horario de atención</label>
            <input className="input" value={settings.workingHours} placeholder="Lun-Vie 9am-6pm"
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Link de agenda (Calendly/Google)</label>
            <input className="input" value={settings.calendarLink} placeholder="https://calendly.com/tu-link"
              onChange={(e) => setSettings({ ...settings, calendarLink: e.target.value })} />
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5">
          <h3 className="text-white font-medium mb-3">Calificación de Prospectos (BANT)</h3>
          <div className="space-y-3">
            {[
              { key: "qualifyBudget", label: "Preguntar sobre presupuesto", desc: "La IA preguntará cuánto tienen planeado invertir" },
              { key: "qualifyTimeline", label: "Preguntar sobre urgencia", desc: "La IA preguntará en qué plazo necesitan el servicio" },
            ].map((opt) => (
              <label key={opt.key} className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input type="checkbox"
                    checked={settings[opt.key as keyof Settings] as boolean}
                    onChange={(e) => setSettings({ ...settings, [opt.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700 peer-checked:bg-brand-500 rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{opt.label}</p>
                  <p className="text-gray-500 text-xs">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Guardando..." : saved ? "✅ Guardado" : "Guardar Cambios"}
          </button>
          {saved && <span className="text-green-400 text-sm">Configuración guardada</span>}
        </div>
      </form>
    </div>
  );
}
