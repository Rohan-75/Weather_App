import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import sunImg from '../assets/clear.png';
import cloudIcon from '../assets/cloud.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';
import drizzleIcon from '../assets/drizzle.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const allIcons = {
    "01d": sunImg,
    "01n": sunImg,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03n": cloudIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async (city) => {
    if (city === "") {
      alert('Enter city');
      return;
    }
  
    setLoading(true);
    setError(""); // Reset the error before each new search
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (!response.ok) {
        // If city is not found, show an alert
        throw new Error("No city found");
      }
  
      const icon = allIcons[data.weather[0].icon] || sunImg;
      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (err) {
      if (err.message === "No city found") {
        setError({ custom_err: "City not found" });
      } else {
        setError({ custom_err: "No Internet connection" });
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    search("salem");
  }, []);

  const inputRef = useRef(null);

  return (
    <div className='Weather'>
      <div className='searchBar'>
        <input type="text" placeholder='Enter city' ref={inputRef} role='submit'/>
        <img src={searchIcon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          {error.custom_err ? (
            <p className='error'>{error.custom_err}</p>
          ) : (
            <div>
              <div className='display'>
                <img src={weatherData.icon} alt="" />
                <p className='cel'>{weatherData.temperature}&deg; C</p>
                <p className='place'>{weatherData.location}</p>
              </div>

              <div className='wind-container'>
                <div className='wind'>
                  <img src={humidityIcon} alt="" />
                  <div>
                    <p>{weatherData.humidity} %</p>
                    <p>Humidity</p>
                  </div>
                </div>

                <div className='wind'>
                  <img src={windIcon} alt="" />
                  <div>
                    <p>{weatherData.wind} km/h</p>
                    <p>Wind Speed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
