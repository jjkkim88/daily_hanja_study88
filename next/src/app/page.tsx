import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Daily Hanja Study</h1>
          <p className="mt-3 text-sm text-base-content/70">
            한자 데이터셋을 확인하고 학습 화면을 구성하기 위한 내부 뷰어입니다.
          </p>

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
              className="inline-flex items-center justify-center rounded-xl border border-base-300 bg-base-100 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-base-200"
            >
              배포 링크
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
