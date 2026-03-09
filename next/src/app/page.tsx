import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-50 via-fuchsia-50 to-slate-50" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-300/25 via-fuchsia-300/20 to-sky-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-14">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">Daily Hanja Study</h1>
            <p className="mt-3 text-sm text-slate-600">한자 데이터셋을 확인하고 학습 화면을 구성하기 위한 내부 뷰어입니다.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/hanja"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                한자 목록 보기
              </Link>
              <a
                href="https://daily-hanja-study88.vercel.app/hanja"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                배포 링크
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
