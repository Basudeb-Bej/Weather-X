import { ForecastCard } from "./ForecastCard";

export function ForecastList({ forecast }) {
  return (
    <section className="glass-panel panel-hover rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">7-day forecast</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Daily outlook</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {forecast.map((day) => (
          <ForecastCard key={day.day} day={day} />
        ))}
      </div>
    </section>
  );
}