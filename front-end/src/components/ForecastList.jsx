import { ForecastCard } from "./ForecastCard";

export function ForecastList({ forecast, selectedDay, onSelectDay }) {
  return (
    <section className="glass-panel panel-hover rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">7-day forecast</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Daily outlook</h2>
        </div>
      </div>

      <div className="mt-4 grid max-h-[26rem] gap-2 overflow-y-auto pr-1 sm:max-h-[33.5rem]">
        {forecast.map((day) => (
          <ForecastCard key={day.day} day={day} selected={selectedDay === day.day} onSelect={onSelectDay} />
        ))}
      </div>
    </section>
  );
}