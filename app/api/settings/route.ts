import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [settings, subscription] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { userId: session.userId } }),
    prisma.subscription.findUnique({ where: { userId: session.userId } }),
  ]);

  return NextResponse.json({
    userId: session.userId,
    settings,
    subscription,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const settings = await prisma.businessSettings.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, ...body },
    update: body,
  });

  return NextResponse.json({ success: true, settings });
}
