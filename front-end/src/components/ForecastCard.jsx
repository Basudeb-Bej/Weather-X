import { formatDayLabel, formatTemperature, mapWeatherCode } from "../utils/weather";
import { WeatherIcon } from "./WeatherIcon";

export function ForecastCard({ day, selected, onSelect }) {
  const weather = mapWeatherCode(day.weatherCode);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(day)}
      className={`w-full rounded-2xl border p-3 text-left transition hover:border-sky-400/30 hover:bg-white/[0.07] ${
        selected ? "border-sky-400/50 bg-sky-400/10 shadow-[0_0_0_1px_rgba(56,189,248,0.15)]" : "border-white/10 bg-white/5"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-100">
            <WeatherIcon icon={weather.icon} className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-white">{formatDayLabel(day.day)}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-slate-400">{weather.label}</p>
          </div>
        </div>
        <div className="text-right text-sm text-slate-200">
          <p className="font-semibold text-white">{formatTemperature(day.max)}</p>
          <p className="text-slate-400">{formatTemperature(day.min)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
        <span>Precipitation</span>
        <span className="font-medium text-white">{day.precipitation ?? 0} mm</span>
      </div>
    </button>
  );
}