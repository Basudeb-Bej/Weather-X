import { useState } from "react";
import { useWeather } from "../hooks/useWeather";
import { useCitySearch } from "../hooks/useCitySearch";
import { formatDateLabel, getWeatherTheme } from "../utils/weather";
import { ForecastList } from "../components/ForecastList";
import { SearchBar } from "../components/SearchBar";
import { WeatherChart } from "../components/WeatherChart";
import { WeatherHeader } from "../components/WeatherHeader";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";

function Home() {
	const [selectedForecastSelection, setSelectedForecastSelection] = useState(null);
	const {
		weather,
		loading,
		error,
		locationStatus,
		searchHint,
		searchCity,
		searchLocation,
		detectLocation,
	} = useWeather();
	const citySearch = useCitySearch();

	const theme = getWeatherTheme(weather?.current?.weatherCode ?? null);
	const weatherSelectionKey = weather?.metadata?.updatedAt ?? weather?.current?.time ?? null;
	const forecast = weather?.forecast ?? [];
	const selectedDay =
		selectedForecastSelection && selectedForecastSelection.weatherKey === weatherSelectionKey
			? forecast.find((day) => day.day === selectedForecastSelection.day) ?? null
			: null;
	const selectedSummary = selectedDay
		? {
			dayLabel: formatDateLabel(selectedDay.day),
			conditionLabel: selectedDay.weatherLabel,
			temperature: `${selectedDay.max}° / ${selectedDay.min}°`,
			precipitation: `${selectedDay.precipitation ?? 0} mm`,
		}
		: null;

	const handleForecastSelect = (day) => {
		setSelectedForecastSelection((currentSelection) =>
			currentSelection && currentSelection.day === day.day && currentSelection.weatherKey === weatherSelectionKey
				? null
				: { day: day.day, weatherKey: weatherSelectionKey },
		);
	};

	return (
		<main className={`min-h-screen ${theme.backgroundClass} text-slate-100`}>
			<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
				<WeatherHeader
					weather={weather}
					subtitle={weather ? formatDateLabel(weather.current.time) : "Allow browser location to load your nearest city automatically"}
					condition={weather?.current?.conditionLabel ?? "Live weather insights"}
					theme={theme}
					portfolioUrl="https://basudeb-bej.me/"
				/>

				<section className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.95fr]">
					<div className="space-y-5">
						<SearchBar
							query={citySearch.query}
							setQuery={citySearch.setQuery}
							suggestions={citySearch.suggestions}
							loadingSuggestions={citySearch.loadingSuggestions}
							isOpen={citySearch.isOpen}
							setIsOpen={citySearch.setIsOpen}
							selectSuggestion={citySearch.selectSuggestion}
							onSearch={searchCity}
							onSearchLocation={searchLocation}
							onUseLocation={detectLocation}
							loading={loading}
							locationStatus={locationStatus}
							searchHint={searchHint}
						/>

						{loading ? <LoadingState /> : null}

						{!loading && error && !weather ? (
							<ErrorState message={error} onRetry={detectLocation} />
						) : null}

						{!loading && weather ? (
							<WeatherChart hourly={weather.hourly} theme={theme} conditionLabel={weather.current.conditionLabel} />
						) : null}
					</div>

					<div className="space-y-5">
						{selectedSummary ? (
							<div className="glass-panel panel-hover rounded-3xl border border-sky-400/20 bg-slate-950/40 p-5 sm:p-6">
								<p className="text-xs uppercase tracking-[0.35em] text-slate-400">Selected forecast</p>
								<h2 className="mt-2 text-xl font-semibold text-white">{selectedSummary.dayLabel}</h2>
								<p className="mt-2 text-sm text-slate-300">{selectedSummary.conditionLabel}</p>
								<div className="mt-4 grid gap-3 sm:grid-cols-2">
									<div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
										<p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Temperature</p>
										<p className="mt-1 text-lg font-semibold text-white">{selectedSummary.temperature}</p>
									</div>
									<div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
										<p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Precipitation</p>
										<p className="mt-1 text-lg font-semibold text-white">{selectedSummary.precipitation}</p>
									</div>
								</div>
							</div>
						) : null}

						{!loading && weather ? (
							<ForecastList
								forecast={forecast}
								theme={theme}
								selectedDay={selectedDay?.day ?? null}
								onSelectDay={handleForecastSelect}
							/>
						) : (
							<div className="glass-panel panel-hover rounded-3xl p-6">
								<p className="text-sm uppercase tracking-[0.24em] text-slate-400">Forecast</p>
								<h2 className="mt-3 text-2xl font-semibold text-white">7-day outlook will appear here</h2>
								<p className="mt-2 text-sm leading-6 text-slate-300">
									Search a city or share your location to load the current conditions, hourly chart, and daily forecast.
								</p>
							</div>
						)}
					</div>
				</section>
			</div>
		</main>
	);
}

export default Home;
