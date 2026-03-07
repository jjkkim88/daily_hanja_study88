'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type VariantKey = 'dongja' | 'sokja' | 'yakja' | 'bonja' | 'ijeja';

type HanjaItem = {
  hanja: string;
  meaning?: string;
  reading?: string;
  source?: string;
  expStrokeAnimation?: string;
  variants?: Record<VariantKey, string[]>;
  naverMeta?: {
    strokeCount?: number;
    radical?: string;
    radicalKoreanName?: string;
  };
  meta?: {
    radicalNumber?: number;
    residualStrokes?: number;
  };
  examplesNaver?: {
    words?: Array<{ word: string; reading: string; meaning: string; source: string }>;
    idiom?: { word: string; reading: string; meaning: string; source: string } | null;
  };
};

type ApiResp = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  start: number;
  end: number;
  items: HanjaItem[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-200">
      {children}
    </span>
  );
}

export default function HanjaPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const pageSize = useMemo(() => clamp(Number(searchParams.pageSize ?? 25) || 25, 10, 100), [searchParams.pageSize]);
  const page = useMemo(() => Math.max(1, Number(searchParams.page ?? 1) || 1), [searchParams.page]);

  const [data, setData] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErr(null);
    setData(null);

    fetch(`/api/hanja?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then((j: ApiResp) => {
        if (!cancelled) setData(j);
      })
      .catch((e) => {
        if (!cancelled) setErr(String(e?.message ?? e));
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  const totalPages = data?.totalPages ?? 1;
  const mkHref = (p: number) => ({ pathname: '/hanja', query: { page: String(p), pageSize: String(pageSize) } });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xl font-bold tracking-tight">한자 1800 뷰어</div>
          <div className="mt-1 text-sm text-slate-400">hanja_study_1800_data.with_strokes.final.json</div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Pill>
            page {page}/{totalPages}
          </Pill>
          <Pill>pageSize {pageSize}</Pill>
          <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
            홈
          </Link>
        </div>
      </header>

      <nav className="mt-4 flex flex-wrap gap-2">
        <Link
          href={mkHref(1)}
          className={`rounded-lg border px-3 py-2 text-sm ${
            page === 1
              ? 'pointer-events-none border-slate-800 bg-slate-950 text-slate-500'
              : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
          }`}
        >
          처음
        </Link>
        <Link
          href={mkHref(page - 1)}
          className={`rounded-lg border px-3 py-2 text-sm ${
            page === 1
              ? 'pointer-events-none border-slate-800 bg-slate-950 text-slate-500'
              : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
          }`}
        >
          이전
        </Link>
        <Link
          href={mkHref(page + 1)}
          className={`rounded-lg border px-3 py-2 text-sm ${
            page === totalPages
              ? 'pointer-events-none border-slate-800 bg-slate-950 text-slate-500'
              : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
          }`}
        >
          다음
        </Link>
        <Link
          href={mkHref(totalPages)}
          className={`rounded-lg border px-3 py-2 text-sm ${
            page === totalPages
              ? 'pointer-events-none border-slate-800 bg-slate-950 text-slate-500'
              : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
          }`}
        >
          끝
        </Link>
      </nav>

      {err ? <div className="mt-4 text-sm text-rose-300">에러: {err}</div> : null}
      {!data && !err ? <div className="mt-4 text-sm text-slate-400">로딩 중...</div> : null}

      <section className="mt-6 grid gap-3">
        {data?.items.map((it, idx) => {
          const num = data.start - 1 + idx + 1;
          const words = it.examplesNaver?.words ?? [];

          return (
            <article key={`${it.hanja}-${num}`} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <div className="text-2xl font-extrabold">{it.hanja}</div>
                  <div className="text-sm text-slate-200">
                    {it.meaning ?? ''} {it.reading ? `(${it.reading})` : ''}
                  </div>
                  {it.source ? <Pill>{it.source}</Pill> : null}
                </div>
                <div className="text-xs text-slate-500">#{num}</div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Pill>총획 {it.naverMeta?.strokeCount ?? '?'}</Pill>
                <Pill>
                  부수 {it.naverMeta?.radical ?? '?'} {it.naverMeta?.radicalKoreanName ? `(${it.naverMeta.radicalKoreanName})` : ''}
                </Pill>
                {it.meta?.radicalNumber ? (
                  <Pill>
                    KX {it.meta.radicalNumber}.{it.meta.residualStrokes ?? '?'}
                  </Pill>
                ) : null}
                {it.expStrokeAnimation ? (
                  <a
                    href={it.expStrokeAnimation}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-300 hover:text-sky-200"
                  >
                    획순 SVG
                  </a>
                ) : (
                  <span className="text-xs text-rose-300">획순 SVG 없음</span>
                )}
              </div>

              <div className="mt-3">
                <div className="mb-1 text-xs text-slate-400">예제 단어 (최대 3)</div>
                {words.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-100">
                    {words.slice(0, 3).map((w) => (
                      <li key={w.word}>
                        <span className="font-semibold">{w.word}</span>
                        {w.reading ? <span className="text-slate-400"> · {w.reading}</span> : null}
                        {w.meaning ? <span className="text-slate-200"> — {w.meaning}</span> : null}
                        <span className="text-xs text-slate-500"> ({w.source})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-500">예제 단어 없음</div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {data ? (
        <footer className="mt-6 text-xs text-slate-500">
          {data.start}–{data.end} / {data.total.toLocaleString()}
        </footer>
      ) : null}
    </main>
  );
}
