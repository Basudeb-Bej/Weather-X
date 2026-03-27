const weatherCodeMap = {
  0: { label: "Clear sky", icon: "sunny", theme: "clear" },
  1: { label: "Mainly clear", icon: "sunny", theme: "clear" },
  2: { label: "Partly cloudy", icon: "cloudy", theme: "clouds" },
  3: { label: "Overcast", icon: "cloudy", theme: "clouds" },
  45: { label: "Fog", icon: "mist", theme: "fog" },
  48: { label: "Depositing rime fog", icon: "mist", theme: "fog" },
  51: { label: "Light drizzle", icon: "rain", theme: "rain" },
  53: { label: "Moderate drizzle", icon: "rain", theme: "rain" },
  55: { label: "Dense drizzle", icon: "rain", theme: "rain" },
  56: { label: "Freezing drizzle", icon: "rain", theme: "rain" },
  57: { label: "Freezing drizzle", icon: "rain", theme: "rain" },
  61: { label: "Light rain", icon: "rain", theme: "rain" },
  63: { label: "Rain", icon: "rain", theme: "rain" },
  65: { label: "Heavy rain", icon: "rain", theme: "rain" },
  66: { label: "Freezing rain", icon: "storm", theme: "storm" },
  67: { label: "Freezing rain", icon: "storm", theme: "storm" },
  71: { label: "Light snow", icon: "snow", theme: "snow" },
  73: { label: "Snow", icon: "snow", theme: "snow" },
  75: { label: "Heavy snow", icon: "snow", theme: "snow" },
  77: { label: "Snow grains", icon: "snow", theme: "snow" },
  80: { label: "Rain showers", icon: "rain", theme: "rain" },
  81: { label: "Rain showers", icon: "rain", theme: "rain" },
  82: { label: "Heavy showers", icon: "rain", theme: "rain" },
  85: { label: "Snow showers", icon: "snow", theme: "snow" },
  86: { label: "Snow showers", icon: "snow", theme: "snow" },
  95: { label: "Thunderstorm", icon: "storm", theme: "storm" },
  96: { label: "Thunderstorm with hail", icon: "storm", theme: "storm" },
  99: { label: "Thunderstorm with hail", icon: "storm", theme: "storm" },
};

const themeClassMap = {
  clear: "weather-bg-clear",
  clouds: "weather-bg-clouds",
  rain: "weather-bg-rain",
  snow: "weather-bg-snow",
  storm: "weather-bg-storm",
  fog: "weather-bg-fog",
};

export function mapWeatherCode(code) {
  return weatherCodeMap[code] ?? { label: "Unknown", icon: "cloudy", theme: "clouds" };
}

export function getWeatherTheme(code) {
  const mapped = mapWeatherCode(code);

  return {
    backgroundClass: themeClassMap[mapped.theme] ?? themeClassMap.clouds,
    accentClass: {
      clear: "from-amber-400/25 via-sky-400/10 to-transparent",
      clouds: "from-slate-400/20 via-sky-400/10 to-transparent",
      rain: "from-sky-500/25 via-cyan-400/12 to-transparent",
      snow: "from-sky-200/22 via-cyan-300/12 to-transparent",
      storm: "from-violet-500/22 via-sky-500/12 to-transparent",
      fog: "from-slate-300/18 via-slate-500/10 to-transparent",
    }[mapped.theme],
    icon: mapped.icon,
    label: mapped.label,
  };
}

export function formatTemperature(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--°";
  }

  return `${Math.round(value)}°`;
}

export function formatWind(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-- km/h";
  }

  return `${Math.round(value)} km/h`;
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--%";
  }

  return `${Math.round(value)}%`;
}

export function formatDateLabel(value) {
  if (!value) {
    return "Updated just now";
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDayLabel(value) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(value));
}

export function formatHourLabel(value) {
  return new Intl.DateTimeFormat("en", { hour: "numeric" }).format(new Date(value));
}

export function buildWeatherModel(forecast, location) {
  const currentCode = forecast?.current?.weather_code ?? null;
  const currentMeta = mapWeatherCode(currentCode);

  const hourlyTimes = forecast?.hourly?.time ?? [];
  const hourlyTemperatures = forecast?.hourly?.temperature_2m ?? [];
  const hourlyCodes = forecast?.hourly?.weather_code ?? [];
  const hourlyPop = forecast?.hourly?.precipitation_probability ?? [];

  const hourly = hourlyTimes.slice(0, 12).map((time, index) => ({
    time,
    temperature: hourlyTemperatures[index],
    weatherCode: hourlyCodes[index],
    precipitationProbability: hourlyPop[index] ?? 0,
  }));

  const dailyTimes = forecast?.daily?.time ?? [];
  const daily = dailyTimes.map((time, index) => ({
    day: time,
    weatherCode: forecast?.daily?.weather_code?.[index],
    max: forecast?.daily?.temperature_2m_max?.[index],
    min: forecast?.daily?.temperature_2m_min?.[index],
    precipitation: forecast?.daily?.precipitation_sum?.[index] ?? 0,
  }));

  return {
    location: {
      name: location?.name ?? location?.display_name ?? "Your location",
      admin1: location?.admin1 ?? location?.country ?? "",
      country: location?.country ?? "",
      latitude: location?.latitude,
      longitude: location?.longitude,
    },
    current: {
      time: forecast?.current?.time ?? new Date().toISOString(),
      temperature: forecast?.current?.temperature_2m,
      feelsLike: forecast?.current?.apparent_temperature,
      humidity: forecast?.current?.relative_humidity_2m,
      windSpeed: forecast?.current?.wind_speed_10m,
      precipitation: forecast?.current?.precipitation,
      conditionCode: currentCode,
      conditionLabel: currentMeta.label,
      icon: currentMeta.icon,
    },
    hourly,
    forecast: daily,
  };
}