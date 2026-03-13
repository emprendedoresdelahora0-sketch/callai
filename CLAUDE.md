# CLAUDE.md — VANTAGE AI SYSTEMS CRM DASHBOARD

## ROL DE CLAUDE EN ESTE PROYECTO
Estás construyendo el dashboard operativo interno de Vantage AI Systems.
Tu objetivo es crear un MVP funcional, rápido de usar y directamente
ligado a cerrar deals y generar cashflow. Nada decorativo. Todo útil.

---

## CONTEXTO DE NEGOCIO

### ¿Qué es Vantage AI Systems?
Firma de Crecimiento con IA (NO agencia de marketing) con sede en Miami, FL.
Producto core: **Sistema NOVA** — agente de IA conversacional que responde
leads en <30 segundos, los califica automáticamente y ejecuta seguimiento
persistente (7, 14, 30 días).
Web: vantageiasystems.com | Email: christian@vantageiasystems.com

### Fundadores
- **Christian Muñoz** — Co-fundador, Technical Lead (Miami)
- **Brian Vanegas** — Co-fundador, Sales Lead / Closer (Charlotte, NC)

---

## MODELO DE NEGOCIO (crítico para los cálculos del dashboard)

### Estructura de precios
| Servicio                 | Setup Fee (único) | MRR (mensual)     |
|--------------------------|-------------------|-------------------|
| NOVA Solo                | $1,500–$2,000     | $300/mes          |
| NOVA + Meta Ads          | $2,500–$3,500     | $500–$800/mes     |
| Infraestructura completa | $4,000–$5,000     | $800–$1,200/mes   |
| Landing page standalone  | $800–$1,000       | Opcional          |
| Red de agentes seguros   | $5,000            | $300/mes/agente   |

**REGLA CRÍTICA DE CÁLCULO:**
- Setup Fee = ingreso único (no recurrente)
- MRR = el negocio real. Siempre mostrar ambos separados, nunca combinados.
- Meta marzo 2026: $5,000 en setup fees (3 cierres locales mínimo)
- Meta largo plazo: 100 clientes × $300 = $30,000/mes MRR

### Nichos objetivo (en orden de prioridad)
1. Redes de agentes de seguros
2. Médicos estéticos / MedSpas
3. Dentistas
4. Abogados (inmigración, accidentes)
5. Realtors
6. Barberías / cadenas

---

## PROSPECTOS ACTIVOS (datos semilla para poblar el CRM)

### LIZ ZEA — Prioridad MÁXIMA
- Empresa: Spiria / Experior Insurance
- Contacto: Brian Vanegas (tiene relación previa)
- Agentes directos: 130–140 | Jerarquía total: 1,600
- Deal: $5,000 setup + $300/mes por agente activo
- Estado: Esperando contrapropuesta (NO contactar hasta que ella escriba)
- MRR potencial: $39,000/mes (130 agentes) → $480,000/mes (1,600)
- Fecha crítica: ~21 marzo 2026

### VALERIE
- Tipo: Agente de seguros salud/vida, Miami
- Contacto: Christian Muñoz
- Estado: Caso de estudio en construcción
- Objetivo: Métricas reales antes del 31/03/2026
- Deal: $1,000–$1,500 setup + $300–$500/mes

### SEBAS (barberías)
- Tipo: Cadena de barberías, Charlotte
- Contacto: Brian Vanegas (conocido personal)
- Estado: No contactado aún — PRIORITARIO para cashflow
- Deal esperado: $1,500–$2,500 setup + $300–$400/mes

### RICHARD PINTO
- Empresa: Glen Enterprise Group LLC (remodelación de baños, Miami)
- Contacto: Christian Muñoz (amigo personal)
- Fase activa: Fase 1 — Landing page + Google Business Profile ($1,000)
- Fases futuras: Fase 2 (ads) → Fase 3 (NOVA completo, $5,000)
- Regla: NO revelar Fase 2 y 3 hasta que pague Fase 1

---

## ESTRUCTURA DEL PIPELINE DE VENTAS

Cada prospecto debe tener estos estados (en orden):
1. **IDENTIFICADO** — en lista, sin contacto
2. **CONTACTADO** — primer mensaje enviado
3. **RESPONDIÓ** — hubo respuesta
4. **DISCOVERY CALL** — llamada agendada o realizada
5. **PROPUESTA ENVIADA** — oferta formal presentada
6. **NEGOCIACIÓN** — objeciones activas
7. **CERRADO GANADO** — pagó, comienza implementación
8. **CERRADO PERDIDO** — se cayó el deal
9. **STANDBY** — esperando acción del prospecto (ej: Liz)

---

## DATOS POR PROSPECTO (campos del CRM)

Cada prospecto debe tener:
- Nombre / Empresa
- Nicho (dropdown con los 6 nichos + "Otro")
- Responsable (Christian o Brian)
- Estado del pipeline (los 9 estados)
- Setup fee mínimo / máximo
- MRR mínimo / máximo
- Prioridad (MÁXIMA / ALTA / MEDIA / BAJA)
- Próxima acción + fecha
- Notas
- Fecha de creación / último contacto

---

## REGLAS DE UI/UX

- Dark theme (fondo #0a0a0a o similar)
- Sin adornos. Solo datos y acciones.
- Métricas siempre visibles arriba: Setup pipeline total / MRR potencial / Meta marzo
- Los prospectos STANDBY deben verse diferente (badge especial)
- CERRADO GANADO = verde. CERRADO PERDIDO = rojo. Todo lo demás = tonos neutros.
- Responsive básico (funciona en desktop, usable en móvil)
