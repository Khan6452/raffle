export function parseParticipants(input: string): string[] {
  // 줄바꿈 기준 + 트림 + 빈 줄 제거
  return (input || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// 암호학적으로 더 안전한 랜덤 (브라우저 Math.random 보다 낫고 서버에서도 OK)
export function pickWinners(participants: string[], count: number): string[] {
  const n = Math.max(1, Math.min(count, participants.length));
  const arr = [...participants];

  // Fisher–Yates using crypto
  for (let i = arr.length - 1; i > 0; i--) {
    const r = crypto.getRandomValues(new Uint32Array(1))[0];
    const j = r % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}