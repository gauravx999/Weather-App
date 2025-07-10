import React, { useState, useEffect } from 'react';
import WeatherBackground from './components/WeatherBackground';
import {
  convertTemperature,
  getVisibilityValue,
  getWindDirection,
  getHumidityValue,
} from './components/Helper';

import {
  HumidityIcon,
  SunriseIcon,
  SunsetIcon,
  VisibilityIcon,
  WindIcon,
} from './components/Icons';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');

  const API_KEY = '85fa02800415830bf9c2fbd89f35a825';

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestion(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestions([]);
  }, [city, weather]);

  const fetchSuggestion = async (query) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const fetchWeatherData = async (url, cityName) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
      setCity(cityName);  // Just name and country now
      setSuggestions([]);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (city.trim().length < 3) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
      setSuggestions([]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />

      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">Weather-App</h1>

          {!weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or country (min 3 letters)"
                className="mb-4 p-3 rounded border border-white bg-transparent text-white focus:border-blue-300 transition duration-300"
              />

              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-black bg-opacity-10 shadow-md rounded z-10">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}`  // ✅ FIXED HERE
                        )
                      }
                      className="block hover:bg-blue-700 bg-transparent px-4 py-2 text-left w-full text-white"
                    >
                      {`${s.name}, ${s.country}`}  {/* ✅ FIXED HERE */}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Get Weather
              </button>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl mb-4">Weather in {city}</h2>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  &deg;{unit}
                </button>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />

              <p className="text-4xl mb-2">
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className="capitalize">{weather.weather[0].description}</p>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [HumidityIcon, 'Humidity', `${weather.main.humidity}% (${getHumidityValue(weather.main.humidity)})`],
                  [WindIcon, 'Wind', `${weather.wind.speed} m/s ${getWindDirection(weather.wind.deg)}`],
                  [VisibilityIcon, 'Visibility', getVisibilityValue(weather.visibility)],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [SunriseIcon, 'Sunrise', weather.sys.sunrise],
                  [SunsetIcon, 'Sunset', weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">
                      {new Date(time * 1000).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm">
                <p>
                  <strong>Feels Like:</strong>{' '}
                  {convertTemperature(weather.main.feels_like, unit)} &deg;{unit}
                </p>
                <p>
                  <strong>Pressure:</strong> {weather.main.pressure} hPa
                </p>
              </div>

              {error && <p className="text-red-400 text-center mt-4">{error}</p>}

              <button
                onClick={() => {
                  setWeather(null);
                  setCity('');
                }}
                className="mt-6 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                New Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
