import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const prospects = await prisma.prospect.findMany({
    where: {
      userId: session.userId,
      ...(status ? { status } : {}),
    },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    include: { call: true, meetings: true },
  });

  return NextResponse.json({ prospects });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, notes } = await req.json();

  const prospect = await prisma.prospect.findFirst({
    where: { id, userId: session.userId },
  });
  if (!prospect) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.prospect.update({
    where: { id },
    data: { ...(status && { status }), ...(notes && { notes }) },
  });

  return NextResponse.json({ prospect: updated });
}
