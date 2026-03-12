"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CYAN = "#00D4F5";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#050a0e" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-xl" style={{ backgroundColor: CYAN }}>N</div>
            <div className="text-left">
              <span className="text-white font-black text-xl tracking-tight block">NOVA</span>
              <span className="text-xs text-gray-500 block -mt-0.5">by Vantage AI Systems</span>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white uppercase">Empieza gratis hoy</h1>
          <p className="text-gray-500 mt-2">7 días de prueba · Sin tarjeta de crédito</p>
        </div>

        <div className="card" style={{ borderColor: "#1a3040" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre completo</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input" placeholder="Juan García" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Contraseña</label>
              <input type="password" required minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input" placeholder="Mínimo 8 caracteres" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 font-black uppercase tracking-wide">
              {loading ? "Creando cuenta..." : "ACTIVAR NOVA GRATIS →"}
            </button>
            <p className="text-xs text-gray-600 text-center">
              Al registrarte aceptas nuestros términos de uso y política de privacidad.
            </p>
          </form>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold hover:opacity-80 transition-opacity" style={{ color: CYAN }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
