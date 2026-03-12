# CallAI - Setup Guide

## Prerequisitos
- Node.js 18+
- Una cuenta de Twilio (twilio.com)
- Una cuenta de Stripe (stripe.com)
- Una API Key de Anthropic (console.anthropic.com)

---

## 1. Instalar dependencias

```bash
cd ai-call-assistant
npm install
```

## 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y completa:

| Variable | Dónde obtenerla |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `TWILIO_ACCOUNT_SID` | twilio.com/console → Dashboard |
| `TWILIO_AUTH_TOKEN` | twilio.com/console → Dashboard |
| `TWILIO_PHONE_NUMBER` | Twilio → Phone Numbers (compra uno ~$1/mes) |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → tu endpoint → Signing secret |
| `STRIPE_PRICE_ID` | Stripe → Products → crea producto $29/mes → copia Price ID |
| `JWT_SECRET` | Cualquier string aleatorio de 32+ caracteres |
| `APP_URL` | Tu dominio de producción (ej: https://callai.tu-dominio.com) |

## 3. Inicializar base de datos

```bash
npm run db:push
npm run db:generate
```

## 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## 5. Configurar Twilio (en producción)

1. Despliega la app en Vercel, Railway, o similar
2. Ve a Twilio Console → Phone Numbers → tu número
3. En "Voice Configuration" → "A call comes in":
   - Webhook: `https://tu-dominio.com/api/twilio/voice?userId=TU_USER_ID`
   - Método: HTTP POST
4. Tu `userId` lo ves en el Dashboard de CallAI

## 6. Configurar Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://tu-dominio.com/api/stripe/webhook`
3. Eventos a escuchar:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copia el "Signing secret" → `STRIPE_WEBHOOK_SECRET`

## 7. Crear producto en Stripe

1. Stripe → Products → Add product
2. Nombre: "CallAI Starter"
3. Precio: $29.00 USD / mes (recurring)
4. Copia el Price ID → `STRIPE_PRICE_ID`

---

## Deploy en Vercel (recomendado)

```bash
npm install -g vercel
vercel --prod
```

Agrega todas las variables de entorno en Vercel Dashboard → Settings → Environment Variables.

Para la base de datos en producción, reemplaza SQLite con PostgreSQL:
1. Crea una DB en Railway, Neon, o Supabase
2. Cambia en `prisma/schema.prisma`: `provider = "postgresql"`
3. Actualiza `DATABASE_URL` con la connection string

---

## Arquitectura del sistema

```
Llamada entrante (Twilio)
        ↓
/api/twilio/voice   ← Reproduce saludo
        ↓
/api/twilio/gather  ← Recibe voz del caller
        ↓
Claude AI (Opus 4.6) ← Procesa y responde
        ↓
TwiML response      ← Reproduce respuesta
        ↓
Loop hasta end_call
        ↓
Guarda en DB: Call + Prospect + Meeting
```

## Personalización del nicho

En Settings → Industria, el sistema ajusta automáticamente el comportamiento:
- **Clínica**: Pregunta síntomas, seguro médico, disponibilidad
- **Bienes Raíces**: Pregunta presupuesto, zona, tipo de propiedad
- **Legal**: Pregunta tipo de caso, urgencia, si ya tienen abogado
- **General**: Calificación estándar BANT

Para personalización avanzada, edita `lib/ai/assistant.ts` → función `buildSystemPrompt()`.
