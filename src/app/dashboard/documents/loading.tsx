export default function Loading() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <div className="h-8 w-56 rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="h-4 w-80 rounded bg-slate-200/40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-200/60 animate-pulse" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-slate-200/40 animate-pulse" />
    </div>
  );
}
