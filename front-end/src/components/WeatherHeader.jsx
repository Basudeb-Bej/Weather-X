import { formatPercent, formatTemperature, formatWind } from "../utils/weather";

function Icon({ icon }) {
  if (icon === "sunny") {
    return (
      <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
        <circle cx="32" cy="32" r="12" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <path d="M32 6v8" />
          <path d="M32 50v8" />
          <path d="M6 32h8" />
          <path d="M50 32h8" />
          <path d="M14 14l6 6" />
          <path d="M44 44l6 6" />
          <path d="M14 50l6-6" />
          <path d="M44 20l6-6" />
        </g>
      </svg>
    );
  }

  if (icon === "rain") {
    return (
      <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
        <path
          d="M20 42h25a10 10 0 0 0 1-20 16 16 0 0 0-31 3 9 9 0 0 0 5 17Z"
          fill="currentColor"
          opacity="0.9"
        />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="4">
          <path d="M22 48l-3 8" />
          <path d="M32 48l-3 8" />
          <path d="M42 48l-3 8" />
        </g>
      </svg>
    );
  }

  if (icon === "snow") {
    return (
      <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
        <path d="M20 24a14 14 0 1 1 24 10H19a10 10 0 0 1 1-10Z" fill="currentColor" opacity="0.9" />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="3">
          <path d="M22 46h0" />
          <path d="M32 46h0" />
          <path d="M42 46h0" />
          <path d="M22 42l0 8" />
          <path d="M18 46h8" />
          <path d="M32 42l0 8" />
          <path d="M28 46h8" />
          <path d="M42 42l0 8" />
          <path d="M38 46h8" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
      <path
        d="M19 42h26a10 10 0 0 0 0-20 15 15 0 0 0-28 4 9 9 0 0 0 2 16Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="30" cy="30" r="6" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function PortfolioMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5V19l-4-2-4 2-4-2-4 2V5.5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M8 8.5h8M8 12h5"
        stroke="rgba(15,23,42,0.9)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getHeroCopy(weather, theme) {
  if (!weather) {
    return {
      eyebrow: "Weather App",
      title: "Weather Dashboard",
      subtitle: "Search a city or allow location access",
      condition: "Live weather insights",
      highlight: "Waiting for live conditions",
      stats: [],
    };
  }

  const current = weather.current;
  const isRainy = ["rain", "storm"].includes(theme.icon === "storm" ? "storm" : theme.backgroundClass.includes("rain") ? "rain" : "");

  return {
    eyebrow: "Weather App",
    title: weather.location?.name || "Weather Dashboard",
    subtitle: `Updated ${new Date(current.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
    condition: current.conditionLabel,
    highlight: isRainy
      ? "Rain-ready forecast with live wind and precipitation details"
      : `Feels like ${formatTemperature(current.feelsLike)} with ${current.conditionLabel.toLowerCase()}`,
    stats: [
      { label: "Temperature", value: formatTemperature(current.temperature) },
      { label: "Feels like", value: formatTemperature(current.feelsLike) },
      { label: "Humidity", value: formatPercent(current.humidity) },
      { label: "Wind", value: formatWind(current.windSpeed) },
    ],
  };
}

export function WeatherHeader({ weather, subtitle, condition, theme, portfolioUrl }) {
  const hero = getHeroCopy(weather, theme);

  return (
    <header className="glass-panel panel-hover relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.accentClass} opacity-80`} />
      <div className="pointer-events-none absolute -right-10 top-6 h-44 w-44 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />

      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-medium text-slate-100 shadow-lg backdrop-blur-md transition hover:border-sky-400/40 hover:bg-slate-900/80 sm:right-6 sm:top-6"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-400/15 text-sky-100">
          <PortfolioMark />
        </span>
        <span> Basudeb Bej</span>
      </a>

      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-sky-200/70">{hero.eyebrow}</p>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{hero.title}</h1>
            <p className="text-sm leading-6 text-slate-200/85 sm:text-base">{weather ? hero.subtitle : subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 backdrop-blur-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.6)]" />
              {weather ? condition : hero.condition}
            </div>
            {weather ? (
              <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm">
                {hero.highlight}
              </div>
            ) : null}
          </div>

          {weather ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {hero.stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="animate-float-soft flex shrink-0 items-center gap-4 text-sky-100 md:justify-end">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-4 shadow-2xl backdrop-blur-md">
            <Icon icon={weather?.current?.icon ?? theme.icon} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Live forecast</p>
            <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {weather ? `${formatTemperature(weather.current.temperature)} ${weather.current.conditionLabel}` : "Modern weather intelligence"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}