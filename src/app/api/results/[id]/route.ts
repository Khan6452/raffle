import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("raffle_results")
    .select("id, round, participants, winners, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );
  }

  const participants = Array.isArray((data as any).participants)
    ? (data as any).participants
    : [];
  const winners = Array.isArray((data as any).winners) ? (data as any).winners : [];

  return NextResponse.json({
    ok: true,
    result: {
      id: data.id,
      round: Number((data as any).round || 0),
      createdAt: (data as any).created_at,
      participantCount: participants.length,
      winnerCount: winners.length,
      participants,
      winners,
    },
  });
}