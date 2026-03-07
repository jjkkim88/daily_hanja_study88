import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Daily Hanja Study</h1>
        <ThemeToggle />
      </div>

      <p className="mt-3 text-sm opacity-80">한자 데이터셋을 확인하는 내부 뷰어입니다.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/hanja" className="btn btn-primary">
          한자 목록 보기
        </Link>
      </div>
    </main>
  );
}
