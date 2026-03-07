import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

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

type Dataset = {
  count: number;
  items: HanjaItem[];
};

let cache: { loadedAt: number; data: Dataset } | null = null;

async function loadDataset(): Promise<Dataset> {
  if (cache) return cache.data;
  const filePath = path.join(process.cwd(), 'data_hanja_study_1800_data.with_strokes.final.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(raw) as Dataset;
  cache = { loadedAt: Date.now(), data };
  return data;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pageSize = clamp(Number(url.searchParams.get('pageSize') ?? 25) || 25, 10, 100);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);

  const dataset = await loadDataset();
  const total = dataset.items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(page, 1, totalPages);

  const start = (safePage - 1) * pageSize;
  const end = Math.min(total, start + pageSize);

  const items = dataset.items.slice(start, end);

  return Response.json({
    total,
    page: safePage,
    pageSize,
    totalPages,
    start: start + 1,
    end,
    items,
  });
}
