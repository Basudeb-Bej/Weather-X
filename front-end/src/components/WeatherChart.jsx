import { formatHourLabel, formatTemperature, mapWeatherCode } from "../utils/weather";

function buildPath(points) {
  if (!points.length) {
    return "";
  }

  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

export function WeatherChart({ hourly, theme, conditionLabel }) {
  const values = hourly.map((item) => item.temperature).filter((value) => value !== undefined && value !== null);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;
  const range = Math.max(maxValue - minValue, 1);
  const chartWidth = 1000;
  const chartHeight = 300;
  const leftPadding = 42;
  const rightPadding = 28;
  const topPadding = 32;
  const bottomPadding = 56;

  const points = hourly.map((item, index) => {
    const normalized = (item.temperature - minValue) / range;
    const x = leftPadding + (index * (chartWidth - leftPadding - rightPadding)) / Math.max(hourly.length - 1, 1);
    const y = topPadding + (1 - normalized) * (chartHeight - topPadding - bottomPadding);

    return { ...item, x, y };
  });

  const linePath = buildPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points.at(-1).x} ${chartHeight - bottomPadding} L ${points[0].x} ${chartHeight - bottomPadding} Z`
    : "";

  const gradientId = `weather-chart-gradient-${theme.icon}`;
  const fillId = `weather-chart-fill-${theme.icon}`;

  return (
    <section className="glass-panel panel-hover rounded-3xl p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Hourly forecast</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Dynamic temperature trend next 12 hours</h2>
        </div>
        <p className="text-xs text-slate-400 sm:text-sm">{conditionLabel} changes the chart color and intensity.</p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950/35 p-4">
        <div className="scrollbar-thin overflow-x-auto pb-1">
          <div className="min-w-[720px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[310px] w-full overflow-visible">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  {theme.icon === "sunny" ? (
                    <>
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="55%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </>
                  ) : theme.icon === "rain" ? (
                    <>
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="55%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#67e8f9" />
                    </>
                  ) : theme.icon === "snow" ? (
                    <>
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="55%" stopColor="#7dd3fc" />
                      <stop offset="100%" stopColor="#bae6fd" />
                    </>
                  ) : theme.icon === "storm" ? (
                    <>
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="55%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="55%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </>
                  )}
                </linearGradient>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.icon === "sunny" ? "rgba(56,189,248,0.35)" : "rgba(56,189,248,0.25)"} />
                  <stop offset="100%" stopColor="rgba(2,6,23,0.02)" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75].map((ratio) => {
                const y = topPadding + (chartHeight - topPadding - bottomPadding) * ratio;

                return (
                  <line
                    key={ratio}
                    x1={leftPadding}
                    x2={chartWidth - rightPadding}
                    y1={y}
                    y2={y}
                    stroke="rgba(148,163,184,0.12)"
                    strokeDasharray="6 8"
                  />
                );
              })}

              {areaPath ? <path d={areaPath} fill={`url(#${fillId})`} /> : null}
              {linePath ? (
                <path
                  d={linePath}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {points.map((point) => {
                const weather = mapWeatherCode(point.weatherCode);
                const dotColor =
                  weather.theme === "storm"
                    ? "#a78bfa"
                    : weather.theme === "rain"
                      ? "#38bdf8"
                      : weather.theme === "snow"
                        ? "#e0f2fe"
                        : weather.theme === "fog"
                          ? "#94a3b8"
                          : "#f59e0b";

                return (
                  <g key={point.time}>
                    <circle cx={point.x} cy={point.y} r="10" fill={dotColor} opacity="0.16" />
                    <circle cx={point.x} cy={point.y} r="5.5" fill={dotColor} stroke="rgba(15,23,42,0.92)" strokeWidth="2" />
                  </g>
                );
              })}

              {points.map((point, index) => {
                const weather = mapWeatherCode(point.weatherCode);
                const labelY = index % 2 === 0 ? 22 : chartHeight - 34;

                return (
                  <g key={`${point.time}-labels`}>
                    <text x={point.x} y={labelY} textAnchor="middle" fill="rgba(226,232,240,0.96)" fontSize="14" fontWeight="600">
                      {formatTemperature(point.temperature)}
                    </text>
                    <text x={point.x} y={labelY + 18} textAnchor="middle" fill="rgba(148,163,184,0.92)" fontSize="12">
                      {formatHourLabel(point.time)}
                    </text>
                    <text x={point.x} y={index % 2 === 0 ? labelY + 36 : labelY - 18} textAnchor="middle" fill="rgba(125,211,252,0.84)" fontSize="11">
                      {weather.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}