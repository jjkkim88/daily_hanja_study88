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

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-lg font-semibold tracking-tight md:text-xl">{children}</h1>;
}

function Subtle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-base-content/60">{children}</div>;
}

function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'primary' | 'secondary' | 'accent' }) {
  const cls =
    tone === 'primary'
      ? 'border-primary/30 bg-primary/10 text-primary'
      : tone === 'secondary'
        ? 'border-secondary/30 bg-secondary/10 text-secondary'
        : tone === 'accent'
          ? 'border-accent/30 bg-accent/10 text-accent'
          : 'border-base-300 bg-base-100 text-base-content/80';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>{children}</span>
  );
}

function ButtonLink({
  href,
  disabled,
  tone = 'neutral',
  children,
}: {
  href: any;
  disabled?: boolean;
  tone?: 'neutral' | 'primary' | 'secondary';
  children: React.ReactNode;
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition shadow-sm border';

  const toneCls =
    tone === 'primary'
      ? 'border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700'
      : tone === 'secondary'
        ? 'border-fuchsia-200 bg-fuchsia-600 text-white hover:bg-fuchsia-700'
        : 'border-base-300 bg-base-100 hover:bg-base-200';

  const disabledCls = disabled ? 'pointer-events-none opacity-40 shadow-none' : '';

  return (
    <Link href={href} className={`${base} ${toneCls} ${disabledCls}`}>
      {children}
    </Link>
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
    <main className="min-h-screen bg-base-200">
      <div className="bg-gradient-to-b from-primary/30 via-secondary/20 to-base-200">
        <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <H1>한자 1800</H1>
            <Subtle>hanja_study_1800_data.with_strokes.final.json</Subtle>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="primary">
              page {page}/{totalPages}
            </Chip>
            <Chip tone="secondary">pageSize {pageSize}</Chip>
            <Link href="/" className="text-sm font-medium text-indigo-700 hover:text-indigo-900">
              홈
            </Link>
          </div>
        </header>

        <nav className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href={mkHref(1)} disabled={page === 1} tone="secondary">
            처음
          </ButtonLink>
          <ButtonLink href={mkHref(page - 1)} disabled={page === 1} tone="secondary">
            이전
          </ButtonLink>
          <ButtonLink href={mkHref(page + 1)} disabled={page === totalPages} tone="primary">
            다음
          </ButtonLink>
          <ButtonLink href={mkHref(totalPages)} disabled={page === totalPages} tone="primary">
            끝
          </ButtonLink>
        </nav>

        {err ? <div className="mt-4 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">에러: {err}</div> : null}
        {!data && !err ? <div className="mt-4 text-sm text-base-content/60">로딩 중...</div> : null}

        <section className="mt-6 grid gap-3">
          {data?.items.map((it, idx) => {
            const num = data.start - 1 + idx + 1;
            const words = it.examplesNaver?.words ?? [];

            return (
              <article
                key={`${it.hanja}-${num}`}
                className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <div className="text-2xl font-extrabold tracking-tight">{it.hanja}</div>
                    <div className="text-sm">
                      {it.meaning ?? ''} {it.reading ? `(${it.reading})` : ''}
                    </div>
                    {it.source ? <Chip tone="accent">{it.source}</Chip> : null}
                  </div>
                  <div className="text-xs text-base-content/50">#{num}</div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Chip tone="primary">총획 {it.naverMeta?.strokeCount ?? '?'}</Chip>
                  <Chip tone="secondary">
                    부수 {it.naverMeta?.radical ?? '?'}{' '}
                    {it.naverMeta?.radicalKoreanName ? `(${it.naverMeta.radicalKoreanName})` : ''}
                  </Chip>
                  {it.meta?.radicalNumber ? (
                    <Chip>
                      KX {it.meta.radicalNumber}.{it.meta.residualStrokes ?? '?'}
                    </Chip>
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

                <div className="mt-3">
                  <div className="mb-1 text-xs text-base-content/60">예제 단어 (최대 3)</div>
                  {words.length ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {words.slice(0, 3).map((w) => (
                        <li key={w.word}>
                          <span className="font-semibold">{w.word}</span>
                          {w.reading ? <span className="text-base-content/60"> · {w.reading}</span> : null}
                          {w.meaning ? <span> — {w.meaning}</span> : null}
                          <span className="text-xs text-base-content/50"> ({w.source})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-base-content/60">예제 단어 없음</div>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {data ? (
          <footer className="mt-6 text-xs text-base-content/60">
            {data.start}–{data.end} / {data.total.toLocaleString()}
          </footer>
        ) : null}
        </div>
      </div>
    </main>
  );
}
