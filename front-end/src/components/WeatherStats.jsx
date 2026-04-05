import { formatPercent, formatTemperature, formatWind } from "../utils/weather";

const statItems = [
  { key: "temp", label: "Temperature" },
  { key: "feelsLike", label: "Feels like" },
  { key: "humidity", label: "Humidity" },
  { key: "windSpeed", label: "Wind" },
];

function getStatValue(key, current) {
  switch (key) {
    case "temp":
      return formatTemperature(current.temperature);
    case "feelsLike":
      return formatTemperature(current.feelsLike);
    case "humidity":
      return formatPercent(current.humidity);
    case "windSpeed":
      return formatWind(current.windSpeed);
    default:
      return "--";
  }
}

export function WeatherStats({ current, theme }) {
  return (
    <section className="glass-panel panel-hover rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Current conditions</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-6xl font-semibold tracking-tight text-white sm:text-7xl">
              {formatTemperature(current.temperature)}
            </span>
            <div className="pb-2 text-xs text-slate-300 sm:text-sm">
              <p>{current.conditionLabel}</p>
              <p className="mt-1 text-slate-400">Updated {new Date(current.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200 sm:text-sm">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Weather type</p>
          <p className="mt-2 text-base font-medium text-white sm:text-lg">{theme.label}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statItems.map((item) => (
          <article key={item.key} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">{getStatValue(item.key, current)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}