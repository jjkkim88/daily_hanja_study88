'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

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
          <div className="mt-1 text-sm opacity-70">hanja_study_1800_data.with_strokes.final.json</div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ThemeToggle />
          <div className="badge badge-outline">page {page}/{totalPages}</div>
          <div className="badge badge-outline">pageSize {pageSize}</div>
          <Link href="/" className="link link-hover text-sm">
            홈
          </Link>
        </div>
      </header>

      <nav className="mt-4 flex flex-wrap gap-2">
        <Link href={mkHref(1)} className={`btn btn-sm ${page === 1 ? 'btn-disabled' : ''}`}>
          처음
        </Link>
        <Link href={mkHref(page - 1)} className={`btn btn-sm ${page === 1 ? 'btn-disabled' : ''}`}>
          이전
        </Link>
        <Link href={mkHref(page + 1)} className={`btn btn-sm ${page === totalPages ? 'btn-disabled' : ''}`}>
          다음
        </Link>
        <Link href={mkHref(totalPages)} className={`btn btn-sm ${page === totalPages ? 'btn-disabled' : ''}`}>
          끝
        </Link>
      </nav>

      {err ? <div className="mt-4 text-sm text-error">에러: {err}</div> : null}
      {!data && !err ? <div className="mt-4 text-sm opacity-70">로딩 중...</div> : null}

      <section className="mt-6 grid gap-3">
        {data?.items.map((it, idx) => {
          const num = data.start - 1 + idx + 1;
          const words = it.examplesNaver?.words ?? [];

          return (
            <article key={`${it.hanja}-${num}`} className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-3 p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <div className="text-2xl font-extrabold">{it.hanja}</div>
                    <div className="text-sm">
                      {it.meaning ?? ''} {it.reading ? `(${it.reading})` : ''}
                    </div>
                    {it.source ? <div className="badge badge-neutral">{it.source}</div> : null}
                  </div>
                  <div className="text-xs opacity-60">#{num}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="badge badge-outline">총획 {it.naverMeta?.strokeCount ?? '?'}</div>
                  <div className="badge badge-outline">
                    부수 {it.naverMeta?.radical ?? '?'} {it.naverMeta?.radicalKoreanName ? `(${it.naverMeta.radicalKoreanName})` : ''}
                  </div>
                  {it.meta?.radicalNumber ? (
                    <div className="badge badge-outline">
                      KX {it.meta.radicalNumber}.{it.meta.residualStrokes ?? '?'}
                    </div>
                  ) : null}
                  {it.expStrokeAnimation ? (
                    <a
                      href={it.expStrokeAnimation}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-hover text-xs"
                    >
                      획순 SVG
                    </a>
                  ) : (
                    <span className="text-xs text-error">획순 SVG 없음</span>
                  )}
                </div>

                <div>
                  <div className="mb-1 text-xs opacity-70">예제 단어 (최대 3)</div>
                  {words.length ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {words.slice(0, 3).map((w) => (
                        <li key={w.word}>
                          <span className="font-semibold">{w.word}</span>
                          {w.reading ? <span className="opacity-70"> · {w.reading}</span> : null}
                          {w.meaning ? <span> — {w.meaning}</span> : null}
                          <span className="text-xs opacity-60"> ({w.source})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm opacity-60">예제 단어 없음</div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {data ? (
        <footer className="mt-6 text-xs opacity-60">
          {data.start}–{data.end} / {data.total.toLocaleString()}
        </footer>
      ) : null}
    </main>
  );
}
