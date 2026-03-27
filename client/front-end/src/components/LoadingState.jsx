export function LoadingState() {
  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-40 rounded-full bg-white/10" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="h-28 rounded-2xl bg-white/10" />
          <div className="h-28 rounded-2xl bg-white/10" />
          <div className="h-28 rounded-2xl bg-white/10" />
          <div className="h-28 rounded-2xl bg-white/10" />
          <div className="h-28 rounded-2xl bg-white/10" />
        </div>
        <div className="h-64 rounded-3xl bg-white/10" />
      </div>
    </section>
  );
}