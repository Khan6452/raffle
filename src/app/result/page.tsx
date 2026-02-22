export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function ResultPage() {
  const { data } = await supabaseServer
    .from("raffle_results")
    .select("id, round, participants, winners, created_at")
    .order("round", { ascending: false });

  if (!data || data.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow">
          아직 기록이 없습니다.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">전체 추첨 기록</h1>

        {data.map((r: any) => {
          const participants = Array.isArray(r.participants) ? r.participants : [];
          const winners = Array.isArray(r.winners) ? r.winners : [];

          return (
            <div
              key={r.id}
              className="bg-white p-4 rounded-2xl shadow border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    제 {r.round}회
                  </div>
                  <div className="text-sm text-gray-500">
                    참여자 {participants.length}명 · 당첨 {winners.length}명
                  </div>
                </div>

                <Link
                  href={`/result/${r.id}`}
                  className="text-sm border px-3 py-1 rounded-lg"
                >
                  상세보기
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
