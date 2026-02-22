import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const { data, error } = await supabaseServer
    .from("raffle_results")
    .select("id, round, participants, winners, created_at")
    .eq("id", id as string)
    .maybeSingle();

  if (error) {
    console.error(error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const participants = Array.isArray(data.participants)
    ? data.participants
    : [];

  const winners = Array.isArray(data.winners)
    ? data.winners
    : [];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold mb-2">
            제 {data.round}회 상세 결과
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(data.created_at).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">당첨자</h2>
          <div className="space-y-2">
            {winners.map((w: string) => (
              <div
                key={w}
                className="border rounded-xl px-4 py-2"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">
            참여자 전체 ({participants.length}명)
          </h2>
          <div className="max-h-80 overflow-auto space-y-1 text-sm">
            {participants.map((p: string, idx: number) => (
              <div key={`${p}-${idx}`}>
                {idx + 1}. {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}