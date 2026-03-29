const WEATHER_CODE_MAP = {
	0: { label: "Clear sky", icon: "sunny", theme: "clear" },
	1: { label: "Mainly clear", icon: "sunny", theme: "clear" },
	2: { label: "Partly cloudy", icon: "cloudy", theme: "clouds" },
	3: { label: "Overcast", icon: "cloudy", theme: "clouds" },
	45: { label: "Fog", icon: "mist", theme: "fog" },
	48: { label: "Depositing rime fog", icon: "mist", theme: "fog" },
	51: { label: "Light drizzle", icon: "rain", theme: "rain" },
	53: { label: "Moderate drizzle", icon: "rain", theme: "rain" },
	55: { label: "Dense drizzle", icon: "rain", theme: "rain" },
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

function formatNumber(value, options = {}) {
	if (value === null || value === undefined || Number.isNaN(Number(value))) {
		return "--";
	}

	return new Intl.NumberFormat("en-US", options).format(Number(value));
}

function normalizeDate(value) {
	return value instanceof Date ? value : new Date(value);
}

export function formatTemperature(value) {
	return `${formatNumber(value, { maximumFractionDigits: 0 })}°`;
}

export function formatPercent(value) {
	return `${formatNumber(value, { maximumFractionDigits: 0 })}%`;
}

export function formatWind(value) {
	return `${formatNumber(value, { maximumFractionDigits: 0 })} km/h`;
}

export function formatDateLabel(value) {
	const date = normalizeDate(value);

	if (Number.isNaN(date.getTime())) {
		return "Updated recently";
	}

	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

export function formatDayLabel(value) {
	const date = normalizeDate(value);

	if (Number.isNaN(date.getTime())) {
		return "--";
	}

	return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

export function formatHourLabel(value) {
	const date = normalizeDate(value);

	if (Number.isNaN(date.getTime())) {
		return "--";
	}

	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

export function mapWeatherCode(code) {
	return WEATHER_CODE_MAP[code] ?? { label: "Unknown", icon: "cloudy", theme: "clouds" };
}

export function getWeatherTheme(code) {
	const weather = mapWeatherCode(code);

	const themeMap = {
		clear: {
			label: weather.label,
			icon: weather.icon,
			backgroundClass: "weather-bg-clear",
			accentClass: "from-amber-400/30 via-sky-400/20 to-cyan-400/20",
		},
		clouds: {
			label: weather.label,
			icon: weather.icon,
			backgroundClass: "weather-bg-clouds",
			accentClass: "from-slate-400/25 via-sky-400/15 to-slate-200/10",
		},
		rain: {
			label: weather.label,
			icon: weather.icon,
			backgroundClass: "weather-bg-rain",
			accentClass: "from-sky-500/30 via-blue-500/20 to-cyan-300/20",
		},
		snow: {
			label: weather.label,
			icon: weather.icon,
			backgroundClass: "weather-bg-snow",
			accentClass: "from-slate-200/30 via-sky-300/15 to-slate-100/10",
		},
		storm: {
			label: weather.label,
			icon: weather.icon,
			backgroundClass: "weather-bg-storm",
			accentClass: "from-violet-500/30 via-sky-400/20 to-indigo-300/20",
		},
		fog: {
			label: weather.label,
			icon: weather.icon,
			backgroundClass: "weather-bg-fog",
			accentClass: "from-slate-300/25 via-sky-300/12 to-slate-100/10",
		},
	};

	return themeMap[weather.theme] ?? themeMap.clouds;
}

function formatCurrentBlock(current, location, weather) {
	return {
		temperature: current.temperature_2m,
		feelsLike: current.apparent_temperature,
		humidity: current.relative_humidity_2m,
		windSpeed: current.wind_speed_10m,
		precipitation: current.precipitation,
		weatherCode: current.weather_code,
		conditionLabel: weather.label,
		icon: weather.icon,
		time: current.time,
		location,
	};
}

export function buildWeatherModel(forecast, location) {
	const currentWeather = mapWeatherCode(forecast?.current?.weather_code);
	const hourlyTimes = forecast?.hourly?.time ?? [];
	const hourlyTemperature = forecast?.hourly?.temperature_2m ?? [];
	const hourlyWeatherCode = forecast?.hourly?.weather_code ?? [];
	const hourlyPrecipitationProbability = forecast?.hourly?.precipitation_probability ?? [];
	const dailyTimes = forecast?.daily?.time ?? [];
	const dailyWeatherCode = forecast?.daily?.weather_code ?? [];
	const dailyMax = forecast?.daily?.temperature_2m_max ?? [];
	const dailyMin = forecast?.daily?.temperature_2m_min ?? [];
	const dailyPrecipitation = forecast?.daily?.precipitation_sum ?? [];

	return {
		location: {
			name: location?.name ?? location?.city ?? "Unknown location",
			admin1: location?.admin1 ?? null,
			country: location?.country ?? null,
			latitude: location?.latitude ?? null,
			longitude: location?.longitude ?? null,
		},
		current: formatCurrentBlock(forecast.current, location, currentWeather),
		hourly: hourlyTimes.slice(0, 12).map((time, index) => {
			const hourlyWeather = mapWeatherCode(hourlyWeatherCode[index]);

			return {
				time,
				temperature: hourlyTemperature[index],
				weatherCode: hourlyWeatherCode[index],
				weatherLabel: hourlyWeather.label,
				icon: hourlyWeather.icon,
				precipitationProbability: hourlyPrecipitationProbability[index] ?? null,
			};
		}),
		forecast: dailyTimes.map((day, index) => {
			const dailyWeather = mapWeatherCode(dailyWeatherCode[index]);

			return {
				day,
				max: dailyMax[index],
				min: dailyMin[index],
				precipitation: dailyPrecipitation[index] ?? 0,
				weatherCode: dailyWeatherCode[index],
				weatherLabel: dailyWeather.label,
				icon: dailyWeather.icon,
			};
		}),
		metadata: {
			source: "Open-Meteo",
			updatedAt: new Date().toISOString(),
		},
	};
}