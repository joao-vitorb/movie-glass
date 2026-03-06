type LoadingStateProps = {
  count?: number;
};

export function LoadingState({ count = 6 }: LoadingStateProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-white/16 bg-white/[0.08]"
        >
          <div className="h-72 animate-pulse bg-white/[0.06]" />

          <div className="space-y-4 p-5">
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.06]" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-white/[0.06]" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.06]" />
            </div>

            <div className="h-6 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/[0.06]" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-white/[0.06]" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}