"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl text-navy">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-navy/60">
        We couldn't load this page. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="primary" onClick={() => reset()}>Try again</Button>
        <Link href="/"><Button variant="outline" className="text-navy border-navy">Go home</Button></Link>
      </div>
    </div>
  );
}
