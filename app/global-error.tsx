"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, send `error` to a logging service — never render its
    // message or stack to the customer.
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center font-body">
        <p className="font-display text-6xl text-navy/20">500</p>
        <h1 className="mt-4 font-display text-2xl text-navy">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-navy/60">
          We hit an unexpected error. Please try again, or come back in a moment.
        </p>
        <button onClick={() => reset()} className="mt-8 bg-navy px-8 py-3.5 text-sm text-cream hover:bg-navy-light">
          Try again
        </button>
      </body>
    </html>
  );
}
