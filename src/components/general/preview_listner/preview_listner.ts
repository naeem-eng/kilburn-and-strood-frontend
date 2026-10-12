// components/PreviewListener.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PreviewListener() {
  const router = useRouter();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // // //console.log({event})
      if (event.data?.type === 'strapiUpdate') {
        router.refresh();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [router]);

  return null;
}