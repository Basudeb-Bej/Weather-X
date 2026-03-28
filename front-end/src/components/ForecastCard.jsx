import { formatDayLabel, formatTemperature, mapWeatherCode } from "../utils/weather";
import { WeatherIcon } from "./WeatherIcon";

export function ForecastCard({ day }) {
  const weather = mapWeatherCode(day.weatherCode);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-sky-400/30 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-100">
            <WeatherIcon icon={weather.icon} className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{formatDayLabel(day.day)}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{weather.label}</p>
          </div>
        </div>
        <div className="text-right text-sm text-slate-200">
          <p className="font-semibold text-white">{formatTemperature(day.max)}</p>
          <p className="text-slate-400">{formatTemperature(day.min)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>Precipitation</span>
        <span className="font-medium text-white">{day.precipitation ?? 0} mm</span>
      </div>
    </article>
  );
}