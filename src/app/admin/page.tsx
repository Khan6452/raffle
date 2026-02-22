"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [entriesText, setEntriesText] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  // ✅ 로그인 처리
  async function handleLogin() {
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "로그인 실패");
      }

      setIsLoggedIn(true);
      setPassword("");
    } catch (e: any) {
      setError(e.message || "로그인 오류");
    }
  }

  // ✅ 추첨 처리
  async function handleDraw() {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entriesText,
          winnerCount,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "추첨 실패");
      }

      setResult(json.result);
    } catch (e: any) {
      setError(e.message || "오류 발생");
    } finally {
      setLoading(false);
    }
  }

  // 🔒 로그인 화면
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
          <h1 className="text-xl font-bold mb-4">관리자 로그인</h1>

          <input
            type="password"
            placeholder="관리자 비밀번호"
            className="w-full border rounded-xl px-4 py-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-xl"
          >
            로그인
          </button>

          {error && (
            <p className="text-red-600 mt-4 text-sm">{error}</p>
          )}
        </div>
      </main>
    );
  }

  // 🎯 관리자 추첨 화면
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          관리자 추첨 페이지
        </h1>

        <textarea
          placeholder="참여자 명단 (줄바꿈으로 구분)"
          className="w-full border rounded-xl px-4 py-3 h-40 mb-4"
          value={entriesText}
          onChange={(e) => setEntriesText(e.target.value)}
        />

        <input
          type="number"
          min={1}
          className="w-32 border rounded-xl px-4 py-2 mb-4"
          value={winnerCount}
          onChange={(e) => setWinnerCount(Number(e.target.value))}
        />

        <button
          onClick={handleDraw}
          disabled={loading}
          className="block bg-black text-white px-6 py-2 rounded-xl"
        >
          {loading ? "추첨 중..." : "추첨하기"}
        </button>

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">
              제 {result.round}회 결과
            </h2>
            <ul className="space-y-1">
              {result.winners.map((w: string) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}