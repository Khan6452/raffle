import { supabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const { data } = await supabaseServer
    .from("raffle_results")
    .select("id, round, participants, winners, created_at")
    .order("round", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p>아직 추첨 결과가 없습니다.</p>
        </div>
      </main>
    );
  }

  const participants = Array.isArray(data.participants) ? data.participants : [];
  const winners = Array.isArray(data.winners) ? data.winners : [];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          🎉 제 {data.round}회 추첨 결과
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          참여자 {participants.length}명 · 당첨 {winners.length}명
        </p>

        <div className="space-y-2">
          {winners.map((w: string) => (
            <div
              key={w}
              className="border rounded-xl px-4 py-2 font-medium"
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}