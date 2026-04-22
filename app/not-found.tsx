import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-sand-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-200">
          <Search size={32} className="text-sand-800" />
        </div>
      </div>
      
      <h1 className="font-heading text-4xl text-ink sm:text-5xl">404</h1>
      <p className="mt-4 text-lg text-slate-600">
        Страница не найдена
      </p>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Возможно, страница была перемещена или удалена. 
        Проверьте правильность адреса или вернитесь на главную.
      </p>
      
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <Home size={16} />
          На главную
        </Link>
        <Link
          href="/catalog"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-sand-300 bg-white px-6 text-sm font-semibold text-ink transition hover:border-sand-400"
        >
          <Search size={16} />
          В каталог
        </Link>
      </div>
    </div>
  );
}