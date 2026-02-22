import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("raffle_results")
    .select("id, round, participants, winners, created_at")
    .order("round", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((r: any) => ({
    id: r.id,
    round: Number(r.round || 0),
    createdAt: r.created_at,
    participantCount: Array.isArray(r.participants) ? r.participants.length : 0,
    winnerCount: Array.isArray(r.winners) ? r.winners.length : 0,
    winners: Array.isArray(r.winners) ? r.winners : [],
  }));

  return NextResponse.json({ ok: true, results });
}