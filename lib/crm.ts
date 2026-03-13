export type Niche =
  | 'seguros'
  | 'medspa'
  | 'dental'
  | 'legal'
  | 'realtors'
  | 'barberias'
  | 'otro'

export type Owner = 'Christian' | 'Brian'

export type Status =
  | 'IDENTIFICADO'
  | 'CONTACTADO'
  | 'RESPONDIO'
  | 'DISCOVERY_CALL'
  | 'PROPUESTA_ENVIADA'
  | 'NEGOCIACION'
  | 'CERRADO_GANADO'
  | 'CERRADO_PERDIDO'
  | 'STANDBY'

export type Priority = 'MAXIMA' | 'ALTA' | 'MEDIA' | 'BAJA'

export interface Prospect {
  id: string
  name: string
  company?: string
  niche: Niche
  owner: Owner
  status: Status
  setupFeeMin: number
  setupFeeMax: number
  mrrMin: number
  mrrMax: number
  priority: Priority
  nextAction?: string
  nextActionDate?: string
  notes?: string
  createdAt: string
  lastContact?: string
}

export const NICHE_LABELS: Record<Niche, string> = {
  seguros: 'Agentes de Seguros',
  medspa: 'MedSpa / Estética',
  dental: 'Dental',
  legal: 'Legal',
  realtors: 'Realtors',
  barberias: 'Barberías',
  otro: 'Otro',
}

export const STATUS_LABELS: Record<Status, string> = {
  IDENTIFICADO: 'Identificado',
  CONTACTADO: 'Contactado',
  RESPONDIO: 'Respondió',
  DISCOVERY_CALL: 'Discovery Call',
  PROPUESTA_ENVIADA: 'Propuesta Enviada',
  NEGOCIACION: 'Negociación',
  CERRADO_GANADO: 'Cerrado Ganado',
  CERRADO_PERDIDO: 'Cerrado Perdido',
  STANDBY: 'Standby',
}

export const STATUS_ORDER: Status[] = [
  'IDENTIFICADO',
  'CONTACTADO',
  'RESPONDIO',
  'DISCOVERY_CALL',
  'PROPUESTA_ENVIADA',
  'NEGOCIACION',
  'CERRADO_GANADO',
  'CERRADO_PERDIDO',
  'STANDBY',
]

export const PRIORITY_LABELS: Record<Priority, string> = {
  MAXIMA: 'Máxima',
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
}

export const SEED_PROSPECTS: Prospect[] = [
  {
    id: 'liz-zea',
    name: 'Liz Zea',
    company: 'Spiria / Experior Insurance',
    niche: 'seguros',
    owner: 'Brian',
    status: 'STANDBY',
    setupFeeMin: 5000,
    setupFeeMax: 5000,
    mrrMin: 39000,
    mrrMax: 480000,
    priority: 'MAXIMA',
    nextAction: 'Esperar contrapropuesta — NO contactar hasta que ella escriba',
    nextActionDate: '2026-03-21',
    notes:
      '130–140 agentes directos, jerarquía total 1,600. Deal: $5,000 setup + $300/mes por agente activo. MRR potencial: $39K/mes (130 agentes) → $480K/mes (1,600). Fecha crítica ~21 marzo.',
    createdAt: '2026-03-01',
    lastContact: '2026-03-10',
  },
  {
    id: 'valerie',
    name: 'Valerie',
    company: '',
    niche: 'seguros',
    owner: 'Christian',
    status: 'DISCOVERY_CALL',
    setupFeeMin: 1000,
    setupFeeMax: 1500,
    mrrMin: 300,
    mrrMax: 500,
    priority: 'ALTA',
    nextAction: 'Cerrar caso de estudio con métricas reales',
    nextActionDate: '2026-03-31',
    notes:
      'Agente de seguros salud/vida, Miami. Caso de estudio en construcción. Objetivo: métricas reales antes del 31/03/2026.',
    createdAt: '2026-03-05',
    lastContact: '2026-03-12',
  },
  {
    id: 'sebas-barberias',
    name: 'Sebas',
    company: 'Cadena de Barberías',
    niche: 'barberias',
    owner: 'Brian',
    status: 'IDENTIFICADO',
    setupFeeMin: 1500,
    setupFeeMax: 2500,
    mrrMin: 300,
    mrrMax: 400,
    priority: 'ALTA',
    nextAction: 'Hacer primer contacto — PRIORITARIO para cashflow',
    nextActionDate: '2026-03-15',
    notes:
      'Cadena de barberías en Charlotte. Conocido personal de Brian. No contactado aún — prioritario para cashflow inmediato.',
    createdAt: '2026-03-10',
  },
  {
    id: 'richard-pinto',
    name: 'Richard Pinto',
    company: 'Glen Enterprise Group LLC',
    niche: 'otro',
    owner: 'Christian',
    status: 'PROPUESTA_ENVIADA',
    setupFeeMin: 1000,
    setupFeeMax: 1000,
    mrrMin: 0,
    mrrMax: 0,
    priority: 'MEDIA',
    nextAction: 'Esperar pago de Fase 1 (Landing + GBP)',
    nextActionDate: '2026-03-20',
    notes:
      'Remodelación de baños, Miami. Amigo personal de Christian. FASE ACTIVA: Fase 1 — Landing page + Google Business Profile ($1,000). NO revelar Fase 2 y 3 hasta que pague Fase 1.',
    createdAt: '2026-03-08',
    lastContact: '2026-03-11',
  },
]

const STORAGE_KEY = 'vantage-crm-prospects'

export function loadProspects(): Prospect[] {
  if (typeof window === 'undefined') return SEED_PROSPECTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_PROSPECTS
    return JSON.parse(raw) as Prospect[]
  } catch {
    return SEED_PROSPECTS
  }
}

export function saveProspects(prospects: Prospect[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects))
}

export function calcMetrics(prospects: Prospect[]) {
  const active = prospects.filter(
    (p) => p.status !== 'CERRADO_PERDIDO'
  )
  const won = prospects.filter((p) => p.status === 'CERRADO_GANADO')

  const setupPipeline = active.reduce((sum, p) => sum + p.setupFeeMax, 0)
  const mrrPipeline = active.reduce((sum, p) => sum + p.mrrMax, 0)
  const setupWon = won.reduce((sum, p) => sum + p.setupFeeMax, 0)
  const marchTarget = 5000

  return { setupPipeline, mrrPipeline, setupWon, marchTarget, wonCount: won.length }
}
