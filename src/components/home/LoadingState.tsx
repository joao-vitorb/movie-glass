type LoadingStateProps = {
  count?: number;
};

export function LoadingState({ count = 6 }: LoadingStateProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-white/16 bg-white/8"
        >
          <div className="aspect-4/5 animate-pulse bg-white/6 sm:aspect-16/10" />

          <div className="space-y-4 p-5">
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/6" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-white/6" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-white/6" />
            </div>

            <div className="h-6 w-3/4 animate-pulse rounded-full bg-white/6" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/6" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-white/6" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/6" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
