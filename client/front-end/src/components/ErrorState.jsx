export function ErrorState({ message, onRetry }) {
  return (
    <section className="glass-panel rounded-3xl border border-rose-500/20 p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.28em] text-rose-300">Weather error</p>
      <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">{message}</h2>
      <p className="mt-1.5 text-sm leading-6 text-slate-300">
        Check the city or try location again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-2xl bg-rose-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-rose-300"
      >
        Try Again
      </button>
    </section>
  );
}