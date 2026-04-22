'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ru">
      <body className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
          </div>
          
          <h1 className="font-heading text-4xl text-ink sm:text-5xl">Критическая ошибка</h1>
          <p className="mt-4 text-lg text-slate-600">
            Произошла серьезная ошибка в приложении
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Приложение столкнулось с непредвиденной ошибкой. Пожалуйста, попробуйте обновить страницу или вернуться позже.
          </p>
          
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              <RefreshCw size={16} />
              Попробовать снова
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-sand-300 bg-white px-6 text-sm font-semibold text-ink transition hover:border-sand-400"
            >
              <Home size={16} />
              На главную
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 max-w-2xl rounded-lg border border-sand-200 bg-sand-50 p-4 text-left">
              <p className="text-xs font-medium text-sand-800">Детали ошибки (только для разработки):</p>
              <pre className="mt-2 overflow-auto text-xs text-sand-600">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}