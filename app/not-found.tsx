import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-6xl text-navy/20">404</p>
      <h1 className="mt-4 font-display text-2xl text-navy">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-navy/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary">Back to homepage</Button>
      </Link>
    </div>
  );
}
