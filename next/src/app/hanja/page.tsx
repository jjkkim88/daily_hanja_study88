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

function pill(text: string, bg = '#1b2440') {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        background: bg,
        border: '1px solid #2b3760',
        fontSize: 12,
        lineHeight: '18px',
        color: '#cfd6ea',
      }}
    >
      {text}
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
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 60px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>한자 1800 뷰어</div>
          <div style={{ marginTop: 6, color: '#aab3cc', fontSize: 13 }}>
            데이터: hanja_study_1800_data.with_strokes.final.json
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {pill(`page ${page}/${totalPages}`, '#122036')}
          {pill(`pageSize ${pageSize}`, '#122036')}
          <Link href="/" style={{ color: '#9dd6ff', fontSize: 13, textDecoration: 'none' }}>
            홈
          </Link>
        </div>
      </header>

      <nav style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link
          href={mkHref(1)}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #2b3760',
            color: '#e8eaf0',
            textDecoration: 'none',
            background: page === 1 ? '#101a31' : '#0f1527',
            pointerEvents: page === 1 ? 'none' : 'auto',
            opacity: page === 1 ? 0.5 : 1,
          }}
        >
          처음
        </Link>
        <Link
          href={mkHref(page - 1)}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #2b3760',
            color: '#e8eaf0',
            textDecoration: 'none',
            background: page === 1 ? '#101a31' : '#0f1527',
            pointerEvents: page === 1 ? 'none' : 'auto',
            opacity: page === 1 ? 0.5 : 1,
          }}
        >
          이전
        </Link>
        <Link
          href={mkHref(page + 1)}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #2b3760',
            color: '#e8eaf0',
            textDecoration: 'none',
            background: page === totalPages ? '#101a31' : '#0f1527',
            pointerEvents: page === totalPages ? 'none' : 'auto',
            opacity: page === totalPages ? 0.5 : 1,
          }}
        >
          다음
        </Link>
        <Link
          href={mkHref(totalPages)}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #2b3760',
            color: '#e8eaf0',
            textDecoration: 'none',
            background: page === totalPages ? '#101a31' : '#0f1527',
            pointerEvents: page === totalPages ? 'none' : 'auto',
            opacity: page === totalPages ? 0.5 : 1,
          }}
        >
          끝
        </Link>
      </nav>

      {err ? <div style={{ marginTop: 14, color: '#ffb4b4' }}>에러: {err}</div> : null}
      {!data && !err ? <div style={{ marginTop: 14, color: '#aab3cc' }}>로딩 중...</div> : null}

      <section style={{ marginTop: 16, display: 'grid', gap: 10 }}>
        {data?.items.map((it, idx) => {
          const num = (data.start - 1) + idx + 1;
          const words = it.examplesNaver?.words ?? [];
          return (
            <article
              key={`${it.hanja}-${num}`}
              style={{
                border: '1px solid #232f55',
                background: '#0f1527',
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{it.hanja}</div>
                  <div style={{ color: '#cfd6ea' }}>
                    {it.meaning ?? ''} {it.reading ? `(${it.reading})` : ''}
                  </div>
                  {it.source ? pill(it.source, '#1a1430') : null}
                </div>
                <div style={{ color: '#8fa0c8', fontSize: 12 }}>#{num}</div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {it.naverMeta?.strokeCount ? pill(`총획 ${it.naverMeta.strokeCount}`, '#122036') : pill('총획 ?', '#2b2333')}
                {it.naverMeta?.radical
                  ? pill(`부수 ${it.naverMeta.radical} (${it.naverMeta.radicalKoreanName ?? ''})`, '#122036')
                  : pill('부수 ?', '#2b2333')}
                {it.meta?.radicalNumber ? pill(`KX ${it.meta.radicalNumber}.${it.meta.residualStrokes ?? '?'}`, '#122036') : null}
                {it.expStrokeAnimation ? (
                  <a
                    href={it.expStrokeAnimation}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#9dd6ff', fontSize: 12, textDecoration: 'none' }}
                  >
                    획순 SVG
                  </a>
                ) : (
                  <span style={{ color: '#ffb4b4', fontSize: 12 }}>획순 SVG 없음</span>
                )}
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ color: '#aab3cc', fontSize: 12, marginBottom: 6 }}>예제 단어 (최대 3)</div>
                {words.length ? (
                  <ul style={{ margin: 0, paddingLeft: 18, color: '#e8eaf0' }}>
                    {words.slice(0, 3).map((w) => (
                      <li key={w.word} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>{w.word}</span>
                        {w.reading ? <span style={{ color: '#aab3cc' }}> · {w.reading}</span> : null}
                        {w.meaning ? <span style={{ color: '#cfd6ea' }}> — {w.meaning}</span> : null}
                        <span style={{ color: '#6f7ea6', fontSize: 12 }}> ({w.source})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: '#6f7ea6', fontSize: 13 }}>예제 단어 없음</div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {data ? (
        <footer style={{ marginTop: 18, color: '#6f7ea6', fontSize: 12 }}>
          {data.start}–{data.end} / {data.total.toLocaleString()}
        </footer>
      ) : null}
    </main>
  );
}
