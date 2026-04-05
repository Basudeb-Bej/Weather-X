import { useCallback, useEffect, useReducer } from "react";
import { buildWeatherModel, formatDateLabel } from "../utils/weather";
import { getForecast, reverseGeocode, saveSearchHistory, searchCities } from "../services/weatherService";

const initialState = {
  weather: null,
  loading: true,
  error: null,
  locationStatus: "idle",
  searchHint: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: action.payload ?? true, error: null, searchHint: null };
    case "success":
      return {
        ...state,
        loading: false,
        error: null,
        searchHint: action.payload?.searchHint ?? null,
        weather: action.payload?.weather ?? action.payload,
      };
    case "error":
      return { ...state, loading: false, error: action.payload, searchHint: null };
    case "location-status":
      return { ...state, locationStatus: action.payload };
    default:
      return state;
  }
}

function getGeolocationPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export function useWeather() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadWeather = useCallback(async (location, labelFallback, historyMeta = {}) => {
    dispatch({ type: "loading" });

    try {
      const forecast = await getForecast(location.latitude, location.longitude);
      let resolvedLocation = location;

      if (!location.name) {
        try {
          resolvedLocation = (await reverseGeocode(location.latitude, location.longitude)) ?? location;
        } catch {
          resolvedLocation = location;
        }
      }

      const weather = buildWeatherModel(forecast, {
        ...resolvedLocation,
        name: resolvedLocation.name ?? labelFallback,
      });

      dispatch({ type: "success", payload: weather });
      void saveSearchHistory({
        searchQuery: historyMeta.searchQuery ?? weather.location.name,
        searchType: historyMeta.searchType ?? (location.name ? "city" : "location"),
        resolvedName: weather.location.name,
        weather: {
          condition: weather.current.conditionLabel,
          code: weather.current.weatherCode,
          temperature: weather.current.temperature,
          feelsLike: weather.current.feelsLike,
          humidity: weather.current.humidity,
          windSpeed: weather.current.windSpeed,
          precipitation: weather.current.precipitation,
        },
      }).catch(() => null);
    } catch (error) {
      dispatch({
        type: "error",
        payload: error instanceof Error ? error.message : "Unable to load weather right now.",
      });
    }
  }, []);

  const detectLocation = useCallback(async () => {
    dispatch({ type: "location-status", payload: "requesting" });

    try {
      const position = await getGeolocationPosition();
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      dispatch({ type: "location-status", payload: "loading" });
      await loadWeather(location, "Nearest city", {
        searchQuery: "Nearest city",
        searchType: "location",
      });
      dispatch({ type: "location-status", payload: "granted" });
    } catch (error) {
      dispatch({ type: "location-status", payload: "denied" });
      dispatch({
        type: "error",
        payload:
          error instanceof Error && error.message
            ? error.message
            : "Location access was denied. Search a city instead.",
      });
      dispatch({ type: "loading", payload: false });
    }
  }, [loadWeather]);

  const searchCity = useCallback(async (query) => {
    dispatch({ type: "loading" });

    try {
      const { results, matchedQuery } = await searchCities(query);

      if (!results.length) {
        throw new Error(`No results found for "${query}".`);
      }

      const [match] = results;
      const weather = await (async () => {
        const forecast = await getForecast(match.latitude, match.longitude);
        let resolvedLocation = match;

        if (!match.name) {
          try {
            resolvedLocation = (await reverseGeocode(match.latitude, match.longitude)) ?? match;
          } catch {
            resolvedLocation = match;
          }
        }

        const built = buildWeatherModel(forecast, {
          ...resolvedLocation,
          name: resolvedLocation.name ?? query,
        });

        return built;
      })();

      dispatch({
        type: "success",
        payload: {
          weather,
          searchHint:
            matchedQuery && matchedQuery.toLowerCase() !== query.trim().toLowerCase()
              ? `Did you mean "${matchedQuery}"? Showing results for that city.`
              : null,
        },
      });
      void saveSearchHistory({
        searchQuery: weather.location.name ?? matchedQuery ?? query,
        searchType: "city",
        resolvedName: weather.location.name,
        weather: {
          condition: weather.current.conditionLabel,
          code: weather.current.weatherCode,
          temperature: weather.current.temperature,
          feelsLike: weather.current.feelsLike,
          humidity: weather.current.humidity,
          windSpeed: weather.current.windSpeed,
          precipitation: weather.current.precipitation,
        },
      }).catch(() => null);
      dispatch({ type: "location-status", payload: "manual" });
    } catch (error) {
      dispatch({
        type: "error",
        payload: error instanceof Error ? error.message : "Unable to search this city.",
      });
    }
  }, [loadWeather]);

  const searchLocation = useCallback(async (location, labelFallback) => {
    await loadWeather(location, labelFallback ?? location.name, {
      searchQuery: labelFallback ?? location.name ?? "Selected location",
      searchType: "location",
    });
    dispatch({ type: "location-status", payload: "manual" });
  }, [loadWeather]);

  useEffect(() => {
    void detectLocation();
  }, [detectLocation]);

  return {
    ...state,
    searchCity,
    searchLocation,
    detectLocation,
    updatedLabel: state.weather ? formatDateLabel(state.weather.current.time) : null,
  };
}