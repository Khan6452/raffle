import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";
import { parseParticipants, pickWinners } from "@/lib/raffle/pickWinners";

export async function POST(req: Request) {
  // ✅ Next 16: cookies()는 async
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { entriesText?: string; winnerCount?: number }
    | null;

  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const participants = parseParticipants(body.entriesText ?? "");

  if (participants.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No participants" },
      { status: 400 }
    );
  }

  const winnerCount = Math.max(
    1,
    Math.floor(Number(body.winnerCount || 1))
  );

  const winners = pickWinners(participants, winnerCount);

  const { data: lastRow, error: lastErr } = await supabaseServer
    .from("raffle_results")
    .select("round")
    .order("round", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastErr) {
    return NextResponse.json(
      { ok: false, error: lastErr.message },
      { status: 500 }
    );
  }

  const nextRound = (lastRow?.round ? Number(lastRow.round) : 0) + 1;

  const { data, error } = await supabaseServer
    .from("raffle_results")
    .insert({
      round: nextRound,
      participants,
      winners,
    })
    .select("id, round, participants, winners, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    result: {
      id: data.id,
      round: Number(data.round || 0),
      createdAt: data.created_at,
      participantCount: participants.length,
      winnerCount: winners.length,
      winners,
    },
  });
}