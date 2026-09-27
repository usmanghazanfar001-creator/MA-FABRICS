export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-10">
        <div className="h-9 w-56 animate-pulse bg-navy/10" />
        <div className="mt-3 h-4 w-24 animate-pulse bg-navy/10" />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse bg-navy/10" />
            <div className="mt-4 h-3 w-16 animate-pulse bg-navy/10" />
            <div className="mt-2 h-4 w-32 animate-pulse bg-navy/10" />
            <div className="mt-2 h-3 w-20 animate-pulse bg-navy/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
