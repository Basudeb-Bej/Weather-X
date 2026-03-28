const WEATHER_CODE_MAP = {
  0: { condition: "Clear sky", icon: "sunny", theme: "clear" },
  1: { condition: "Mainly clear", icon: "sunny", theme: "clear" },
  2: { condition: "Partly cloudy", icon: "cloudy", theme: "clouds" },
  3: { condition: "Overcast", icon: "cloudy", theme: "clouds" },
  45: { condition: "Fog", icon: "mist", theme: "fog" },
  48: { condition: "Depositing rime fog", icon: "mist", theme: "fog" },
  51: { condition: "Light drizzle", icon: "rain", theme: "rain" },
  53: { condition: "Moderate drizzle", icon: "rain", theme: "rain" },
  55: { condition: "Dense drizzle", icon: "rain", theme: "rain" },
  61: { condition: "Light rain", icon: "rain", theme: "rain" },
  63: { condition: "Rain", icon: "rain", theme: "rain" },
  65: { condition: "Heavy rain", icon: "rain", theme: "rain" },
  66: { condition: "Freezing rain", icon: "storm", theme: "storm" },
  67: { condition: "Freezing rain", icon: "storm", theme: "storm" },
  71: { condition: "Light snow", icon: "snow", theme: "snow" },
  73: { condition: "Snow", icon: "snow", theme: "snow" },
  75: { condition: "Heavy snow", icon: "snow", theme: "snow" },
  77: { condition: "Snow grains", icon: "snow", theme: "snow" },
  80: { condition: "Rain showers", icon: "rain", theme: "rain" },
  81: { condition: "Rain showers", icon: "rain", theme: "rain" },
  82: { condition: "Heavy showers", icon: "rain", theme: "rain" },
  85: { condition: "Snow showers", icon: "snow", theme: "snow" },
  86: { condition: "Snow showers", icon: "snow", theme: "snow" },
  95: { condition: "Thunderstorm", icon: "storm", theme: "storm" },
  96: { condition: "Thunderstorm with hail", icon: "storm", theme: "storm" },
  99: { condition: "Thunderstorm with hail", icon: "storm", theme: "storm" },
};

function getWeatherMeta(code) {
  return WEATHER_CODE_MAP[code] || { condition: "Unknown", icon: "cloudy", theme: "clouds" };
}

function toDisplayDate(value) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function toDayLabel(value) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(value));
}

function buildWeatherResponse({ location, forecast }) {
  const currentMeta = getWeatherMeta(forecast.current.weather_code);
  const hourlyTimes = forecast.hourly?.time || [];
  const dailyTimes = forecast.daily?.time || [];

  return {
    location: {
      city: location.name,
      region: location.admin1 || null,
      country: location.country || null,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: forecast.timezone,
    },
    current: {
      temperature: forecast.current.temperature_2m,
      feelsLike: forecast.current.apparent_temperature,
      condition: currentMeta.condition,
      icon: currentMeta.icon,
      timestamp: forecast.current.time,
      readableTimestamp: toDisplayDate(forecast.current.time),
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: forecast.current.wind_speed_10m,
      precipitation: forecast.current.precipitation,
      weatherCode: forecast.current.weather_code,
    },
    hourly: hourlyTimes.slice(0, 12).map((time, index) => {
      const code = forecast.hourly.weather_code?.[index];
      const meta = getWeatherMeta(code);

      return {
        timestamp: time,
        readableTimestamp: toDisplayDate(time),
        temperature: forecast.hourly.temperature_2m?.[index],
        precipitationProbability: forecast.hourly.precipitation_probability?.[index] ?? null,
        condition: meta.condition,
        icon: meta.icon,
      };
    }),
    forecast: dailyTimes.map((date, index) => {
      const code = forecast.daily.weather_code?.[index];
      const meta = getWeatherMeta(code);

      return {
        date,
        day: toDayLabel(date),
        maxTemperature: forecast.daily.temperature_2m_max?.[index],
        minTemperature: forecast.daily.temperature_2m_min?.[index],
        precipitation: forecast.daily.precipitation_sum?.[index] ?? 0,
        condition: meta.condition,
        icon: meta.icon,
      };
    }),
    metadata: {
      source: "Open-Meteo",
      updatedAt: new Date().toISOString(),
    },
  };
}

module.exports = {
  getWeatherMeta,
  buildWeatherResponse,
};