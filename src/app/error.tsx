'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hata detayını konsola yaz (geliştirme ve raporlama için)
    console.error('Uygulama hatası:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-amber-800">
          Bir hata oluştu
        </h2>
        <p className="mb-4 text-sm text-amber-700">
          İstemci tarafında beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
          Sorun devam ederse tarayıcı konsolundaki hata mesajını kontrol edin.
        </p>
        <Button
          onClick={reset}
          variant="outline"
          className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
        >
          Tekrar dene
        </Button>
      </div>
    </div>
  );
}
