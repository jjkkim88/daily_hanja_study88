"use client";

import { useEffect, useMemo, useState } from "react";
import type { HanjaDataset, HanjaItem } from "@/lib/types";

export default function Home() {
  const [items, setItems] = useState<HanjaItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/data/hanja_study_1800_data.json", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as HanjaDataset;
        if (!alive) return;
        setItems(data.items || []);
      } catch (e: any) {
        if (!alive) return;
        setError(String(e?.message || e));
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const count = items.length;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Daily Hanja Learning</h1>
      <p className="mt-2 text-sm text-neutral-600">
        dataset: /data/hanja_study_1800_data.json ({count} items)
      </p>

      {error ? (
        <div className="mt-6 rounded border bg-amber-50 p-4 text-sm">
          데이터를 불러오지 못했습니다.
          <div className="mt-2 font-mono text-xs">{error}</div>
        </div>
      ) : count === 0 ? (
        <div className="mt-6 rounded border bg-neutral-50 p-4 text-sm">
          로딩 중…
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2">한자</th>
                <th className="px-3 py-2">훈</th>
                <th className="px-3 py-2">음</th>
                <th className="px-3 py-2">source</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 200).map((it) => (
                <tr key={it.hanja} className="border-t">
                  <td className="px-3 py-2 text-lg">{it.hanja}</td>
                  <td className="px-3 py-2">{it.meaning}</td>
                  <td className="px-3 py-2">{it.reading}</td>
                  <td className="px-3 py-2 text-neutral-600">{it.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        현재는 상위 200개만 렌더링. 다음 단계에서 검색/필터/데일리 세트 생성 UI 추가.
      </p>
    </main>
  );
}
