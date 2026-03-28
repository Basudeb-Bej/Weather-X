import { useWeather } from "../hooks/useWeather";
import { useCitySearch } from "../hooks/useCitySearch";
import { formatDateLabel, getWeatherTheme } from "../utils/weather";
import { ForecastList } from "../components/ForecastList";
import { SearchBar } from "../components/SearchBar";
import { WeatherChart } from "../components/WeatherChart";
import { WeatherHeader } from "../components/WeatherHeader";
import { WeatherStats } from "../components/WeatherStats";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";

function Home() {
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

	const theme = getWeatherTheme(weather?.current?.conditionCode ?? null);

	return (
		<main className={`min-h-screen ${theme.backgroundClass} text-slate-100`}>
			<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
				<WeatherHeader
					weather={weather}
					subtitle={weather ? formatDateLabel(weather.current.time) : "Search a city or allow location access"}
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
							loading={loading}
							locationStatus={locationStatus}
							searchHint={searchHint}
						/>

						{loading ? <LoadingState /> : null}

						{!loading && error && !weather ? (
							<ErrorState message={error} onRetry={detectLocation} />
						) : null}

						{!loading && weather ? (
							<WeatherStats current={weather.current} theme={theme} />
						) : null}

						{!loading && weather ? (
							<WeatherChart hourly={weather.hourly} theme={theme} conditionLabel={weather.current.conditionLabel} />
						) : null}
					</div>

					<div className="space-y-5">
						{!loading && weather ? (
							<ForecastList forecast={weather.forecast} theme={theme} />
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
