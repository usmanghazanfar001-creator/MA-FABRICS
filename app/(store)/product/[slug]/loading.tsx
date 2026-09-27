export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="aspect-[3/4] animate-pulse bg-navy/10" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse bg-navy/10" />
          <div className="h-9 w-64 animate-pulse bg-navy/10" />
          <div className="h-4 w-full max-w-md animate-pulse bg-navy/10" />
          <div className="h-4 w-3/4 max-w-md animate-pulse bg-navy/10" />
          <div className="mt-8 h-24 w-full max-w-md animate-pulse bg-navy/10" />
        </div>
      </div>
    </div>
  );
}
