'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Prospect,
  Status,
  Niche,
  Owner,
  Priority,
  NICHE_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
  PRIORITY_LABELS,
  loadProspects,
  saveProspects,
  calcMetrics,
} from '@/lib/crm'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ─── styling maps ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<Status, string> = {
  IDENTIFICADO: 'bg-zinc-800 text-zinc-300',
  CONTACTADO: 'bg-blue-950 text-blue-300',
  RESPONDIO: 'bg-indigo-950 text-indigo-300',
  DISCOVERY_CALL: 'bg-violet-950 text-violet-300',
  PROPUESTA_ENVIADA: 'bg-amber-950 text-amber-300',
  NEGOCIACION: 'bg-orange-950 text-orange-300',
  CERRADO_GANADO: 'bg-emerald-950 text-emerald-300',
  CERRADO_PERDIDO: 'bg-red-950 text-red-400',
  STANDBY: 'bg-cyan-950 text-cyan-300 border border-cyan-700',
}

const PRIORITY_STYLE: Record<Priority, string> = {
  MAXIMA: 'text-red-400 font-black',
  ALTA: 'text-orange-400 font-bold',
  MEDIA: 'text-yellow-600',
  BAJA: 'text-zinc-500',
}

const NICHE_ICON: Record<Niche, string> = {
  seguros: '🛡️',
  medspa: '💉',
  dental: '🦷',
  legal: '⚖️',
  realtors: '🏠',
  barberias: '✂️',
  otro: '📦',
}

// ─── blank form ──────────────────────────────────────────────────────────────

const BLANK: Omit<Prospect, 'id' | 'createdAt'> = {
  name: '',
  company: '',
  niche: 'seguros',
  owner: 'Christian',
  status: 'IDENTIFICADO',
  setupFeeMin: 0,
  setupFeeMax: 0,
  mrrMin: 0,
  mrrMax: 0,
  priority: 'MEDIA',
  nextAction: '',
  nextActionDate: '',
  notes: '',
  lastContact: '',
}

// ─── component ───────────────────────────────────────────────────────────────

export default function CRMPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [filterOwner, setFilterOwner] = useState<Owner | 'Todos'>('Todos')
  const [filterStatus, setFilterStatus] = useState<Status | 'Todos'>('Todos')
  const [filterNiche, setFilterNiche] = useState<Niche | 'Todos'>('Todos')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Prospect | null>(null)
  const [form, setForm] = useState<Omit<Prospect, 'id' | 'createdAt'>>(BLANK)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    setProspects(loadProspects())
  }, [])

  const persist = useCallback((updated: Prospect[]) => {
    setProspects(updated)
    saveProspects(updated)
  }, [])

  function openAdd() {
    setForm(BLANK)
    setEditing(null)
    setModal('add')
  }

  function openEdit(p: Prospect) {
    setForm({
      name: p.name,
      company: p.company ?? '',
      niche: p.niche,
      owner: p.owner,
      status: p.status,
      setupFeeMin: p.setupFeeMin,
      setupFeeMax: p.setupFeeMax,
      mrrMin: p.mrrMin,
      mrrMax: p.mrrMax,
      priority: p.priority,
      nextAction: p.nextAction ?? '',
      nextActionDate: p.nextActionDate ?? '',
      notes: p.notes ?? '',
      lastContact: p.lastContact ?? '',
    })
    setEditing(p)
    setModal('edit')
  }

  function saveForm() {
    if (!form.name.trim()) return
    if (modal === 'add') {
      const created: Prospect = {
        ...form,
        id: newId(),
        createdAt: new Date().toISOString().slice(0, 10),
      }
      persist([created, ...prospects])
    } else if (editing) {
      persist(
        prospects.map((p) =>
          p.id === editing.id ? { ...editing, ...form } : p
        )
      )
    }
    setModal(null)
  }

  function deleteProspect(id: string) {
    if (!confirm('¿Eliminar este prospecto?')) return
    persist(prospects.filter((p) => p.id !== id))
  }

  function quickStatus(id: string, status: Status) {
    persist(prospects.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  const filtered = prospects.filter((p) => {
    if (filterOwner !== 'Todos' && p.owner !== filterOwner) return false
    if (filterStatus !== 'Todos' && p.status !== filterStatus) return false
    if (filterNiche !== 'Todos' && p.niche !== filterNiche) return false
    return true
  })

  const metrics = calcMetrics(prospects)
  const marchPct = Math.min(
    100,
    Math.round((metrics.setupWon / metrics.marchTarget) * 100)
  )

  return (
    <div className="min-h-screen text-sm" style={{ backgroundColor: '#0a0a0a', color: '#e5e7eb' }}>
      {/* ── header ── */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ borderColor: '#1f1f1f', backgroundColor: '#0a0a0a' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center font-black text-black text-base"
            style={{ backgroundColor: '#00D4F5' }}
          >
            V
          </div>
          <div>
            <span className="font-black text-white tracking-tight">Vantage AI Systems</span>
            <span className="ml-2 text-xs text-zinc-500">CRM Interno</span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded font-bold text-xs uppercase tracking-wide text-black"
          style={{ backgroundColor: '#00D4F5' }}
        >
          + Nuevo Prospecto
        </button>
      </header>

      {/* ── metrics bar ── */}
      <div
        className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b"
        style={{ borderColor: '#1f1f1f' }}
      >
        <MetricCard
          label="Setup Pipeline"
          value={fmt(metrics.setupPipeline)}
          sub="Ingreso único potencial"
        />
        <MetricCard
          label="MRR Potencial"
          value={fmt(metrics.mrrPipeline)}
          sub="Recurrente mensual"
          highlight
        />
        <MetricCard
          label="Cerrados Ganados"
          value={`${metrics.wonCount} deal${metrics.wonCount !== 1 ? 's' : ''}`}
          sub={`${fmt(metrics.setupWon)} en setup`}
        />
        <div
          className="rounded-lg p-4 border"
          style={{ backgroundColor: '#111', borderColor: '#1f1f1f' }}
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Meta Marzo</p>
          <p className="text-xl font-black text-white">
            {fmt(metrics.setupWon)}{' '}
            <span className="text-sm font-normal text-zinc-500">/ $5,000</span>
          </p>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: '#1f1f1f' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${marchPct}%`, backgroundColor: marchPct >= 100 ? '#22c55e' : '#00D4F5' }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">{marchPct}% completado</p>
        </div>
      </div>

      {/* ── filters ── */}
      <div
        className="px-6 py-3 flex flex-wrap gap-3 border-b"
        style={{ borderColor: '#1f1f1f' }}
      >
        <FilterSelect
          label="Owner"
          value={filterOwner}
          onChange={(v) => setFilterOwner(v as Owner | 'Todos')}
          options={['Todos', 'Christian', 'Brian']}
        />
        <FilterSelect
          label="Estado"
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as Status | 'Todos')}
          options={['Todos', ...STATUS_ORDER]}
          labelMap={STATUS_LABELS}
        />
        <FilterSelect
          label="Nicho"
          value={filterNiche}
          onChange={(v) => setFilterNiche(v as Niche | 'Todos')}
          options={['Todos', 'seguros', 'medspa', 'dental', 'legal', 'realtors', 'barberias', 'otro']}
          labelMap={NICHE_LABELS}
        />
        <span className="text-xs text-zinc-600 self-center ml-auto">
          {filtered.length} prospecto{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── table ── */}
      <div className="px-6 py-4 overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-600 py-16">No hay prospectos con estos filtros.</p>
        ) : (
          <table className="w-full border-separate" style={{ borderSpacing: '0 4px' }}>
            <thead>
              <tr className="text-xs uppercase tracking-wide text-zinc-600">
                <th className="text-left px-3 py-2">Prospecto</th>
                <th className="text-left px-3 py-2">Nicho</th>
                <th className="text-left px-3 py-2">Owner</th>
                <th className="text-left px-3 py-2">Estado</th>
                <th className="text-right px-3 py-2">Setup</th>
                <th className="text-right px-3 py-2">MRR</th>
                <th className="text-left px-3 py-2">Prioridad</th>
                <th className="text-left px-3 py-2">Próxima Acción</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <>
                  <tr
                    key={p.id}
                    className="cursor-pointer group"
                    style={{ backgroundColor: '#111' }}
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  >
                    <td className="px-3 py-3 rounded-l-lg">
                      <p className="font-semibold text-white leading-tight">{p.name}</p>
                      {p.company && (
                        <p className="text-xs text-zinc-500 leading-tight mt-0.5">{p.company}</p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-zinc-400">
                        {NICHE_ICON[p.niche]} {NICHE_LABELS[p.niche]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: p.owner === 'Christian' ? '#1e3a5f' : '#2d1b4e',
                          color: p.owner === 'Christian' ? '#93c5fd' : '#c4b5fd',
                        }}
                      >
                        {p.owner}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_STYLE[p.status]}`}>
                        {p.status === 'STANDBY' ? '⏸ ' : ''}
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-white font-mono">
                      {p.setupFeeMin === p.setupFeeMax
                        ? fmt(p.setupFeeMax)
                        : `${fmt(p.setupFeeMin)}–${fmt(p.setupFeeMax)}`}
                    </td>
                    <td className="px-3 py-3 text-right font-mono" style={{ color: '#00D4F5' }}>
                      {p.mrrMax === 0
                        ? '—'
                        : p.mrrMin === p.mrrMax
                          ? fmt(p.mrrMax)
                          : `${fmt(p.mrrMin)}–${fmt(p.mrrMax)}`}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs ${PRIORITY_STYLE[p.priority]}`}>
                        {PRIORITY_LABELS[p.priority]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-400 max-w-xs truncate">
                      {p.nextActionDate && (
                        <span className="text-zinc-600 mr-1">{p.nextActionDate}</span>
                      )}
                      {p.nextAction}
                    </td>
                    <td
                      className="px-3 py-3 rounded-r-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs text-zinc-500 hover:text-white px-2 py-1 rounded"
                          style={{ backgroundColor: '#1a1a1a' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteProspect(p.id)}
                          className="text-xs text-red-800 hover:text-red-400 px-2 py-1 rounded"
                          style={{ backgroundColor: '#1a1a1a' }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* expanded row */}
                  {expandedId === p.id && (
                    <tr key={`${p.id}-expanded`}>
                      <td
                        colSpan={9}
                        className="px-6 pb-4 rounded-b-lg"
                        style={{ backgroundColor: '#0e0e0e', borderTop: '1px solid #1a1a1a' }}
                      >
                        <div className="grid md:grid-cols-3 gap-4 pt-3">
                          {p.notes && (
                            <div>
                              <p className="text-xs text-zinc-600 uppercase tracking-wide mb-1">Notas</p>
                              <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{p.notes}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-zinc-600 uppercase tracking-wide mb-1">
                              Cambiar Estado
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {STATUS_ORDER.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => quickStatus(p.id, s)}
                                  className={`text-xs px-2 py-1 rounded font-medium transition-opacity ${
                                    p.status === s ? 'opacity-100' : 'opacity-30 hover:opacity-70'
                                  } ${STATUS_STYLE[s]}`}
                                >
                                  {STATUS_LABELS[s]}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-zinc-500 space-y-1">
                            <p>
                              <span className="text-zinc-600">Creado:</span> {p.createdAt}
                            </p>
                            {p.lastContact && (
                              <p>
                                <span className="text-zinc-600">Último contacto:</span> {p.lastContact}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── modal ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div
            className="w-full max-w-xl rounded-xl border p-6 overflow-y-auto max-h-[80vh]"
            style={{ backgroundColor: '#111', borderColor: '#2a2a2a' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-white text-base">
                {modal === 'add' ? 'Nuevo Prospecto' : `Editar: ${editing?.name}`}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-zinc-500 hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nombre *">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-crm"
                    placeholder="Nombre o alias"
                  />
                </FormField>
                <FormField label="Empresa">
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="input-crm"
                    placeholder="Nombre de empresa"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Nicho">
                  <select
                    value={form.niche}
                    onChange={(e) => setForm({ ...form, niche: e.target.value as Niche })}
                    className="input-crm"
                  >
                    {Object.entries(NICHE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Responsable">
                  <select
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value as Owner })}
                    className="input-crm"
                  >
                    <option>Christian</option>
                    <option>Brian</option>
                  </select>
                </FormField>
                <FormField label="Prioridad">
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className="input-crm"
                  >
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Estado del Pipeline">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                  className="input-crm"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Setup Fee Mín ($)">
                  <input
                    type="number"
                    value={form.setupFeeMin}
                    onChange={(e) => setForm({ ...form, setupFeeMin: Number(e.target.value) })}
                    className="input-crm"
                  />
                </FormField>
                <FormField label="Setup Fee Máx ($)">
                  <input
                    type="number"
                    value={form.setupFeeMax}
                    onChange={(e) => setForm({ ...form, setupFeeMax: Number(e.target.value) })}
                    className="input-crm"
                  />
                </FormField>
                <FormField label="MRR Mín ($)">
                  <input
                    type="number"
                    value={form.mrrMin}
                    onChange={(e) => setForm({ ...form, mrrMin: Number(e.target.value) })}
                    className="input-crm"
                  />
                </FormField>
                <FormField label="MRR Máx ($)">
                  <input
                    type="number"
                    value={form.mrrMax}
                    onChange={(e) => setForm({ ...form, mrrMax: Number(e.target.value) })}
                    className="input-crm"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Próxima Acción">
                  <input
                    value={form.nextAction}
                    onChange={(e) => setForm({ ...form, nextAction: e.target.value })}
                    className="input-crm"
                    placeholder="¿Qué hacer?"
                  />
                </FormField>
                <FormField label="Fecha">
                  <input
                    type="date"
                    value={form.nextActionDate}
                    onChange={(e) => setForm({ ...form, nextActionDate: e.target.value })}
                    className="input-crm"
                  />
                </FormField>
              </div>

              <FormField label="Último Contacto">
                <input
                  type="date"
                  value={form.lastContact}
                  onChange={(e) => setForm({ ...form, lastContact: e.target.value })}
                  className="input-crm"
                />
              </FormField>

              <FormField label="Notas">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input-crm resize-none"
                  rows={4}
                  placeholder="Contexto, reglas, recordatorios..."
                />
              </FormField>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveForm}
                disabled={!form.name.trim()}
                className="flex-1 py-2.5 rounded font-bold text-sm text-black disabled:opacity-40"
                style={{ backgroundColor: '#00D4F5' }}
              >
                {modal === 'add' ? 'Crear Prospecto' : 'Guardar Cambios'}
              </button>
              <button
                onClick={() => setModal(null)}
                className="px-5 py-2.5 rounded font-bold text-sm text-zinc-400"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      className="rounded-lg p-4 border"
      style={{
        backgroundColor: '#111',
        borderColor: highlight ? 'rgba(0,212,245,0.25)' : '#1f1f1f',
      }}
    >
      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</p>
      <p
        className="text-2xl font-black"
        style={{ color: highlight ? '#00D4F5' : '#fff' }}
      >
        {value}
      </p>
      <p className="text-xs text-zinc-600 mt-1">{sub}</p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labelMap,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  labelMap?: Record<string, string>
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-500">
      <span>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1 text-xs"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labelMap && o !== 'Todos' ? labelMap[o] ?? o : o}
          </option>
        ))}
      </select>
    </label>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
