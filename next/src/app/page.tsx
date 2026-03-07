import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Daily Hanja Study</h1>
      <p className="mt-3 text-sm text-slate-300">
        한자 데이터셋을 확인하는 내부 뷰어입니다.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/hanja"
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
        >
          한자 목록 보기
        </Link>
      </div>
    </main>
  );
}
