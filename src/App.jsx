import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import axios from "axios";
import { Thermometer, Droplet, Wind } from "lucide-react";
import { motion } from "framer-motion";

// Animation Configurations
const iconAnimation = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: "spring", stiffness: 150, damping: 10 },
};

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [localTime, setLocalTime] = useState("");

  const fetchWeather = async () => {
    if (!location) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=c27a09fa10611a55a87d5eec75abd7bf`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      setIsCelsius(false);
      updateLocalTime(response.data.timezone);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    setLocation("");
  };

  const updateLocalTime = (timezoneOffset) => {
    const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
    setLocalTime(new Date(utcTime + timezoneOffset * 1000).toLocaleString());
  };

  const convertTemp = (temp) =>
    isCelsius ? (((temp - 32) * 5) / 9).toFixed() : temp.toFixed();

  return (
    <div className="app">
      <div className="search">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          placeholder="Enter Location"
        />
      </div>

      {data && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p className="location-name">{data.name}</p>
              <p className="local-time">{localTime}</p>
            </div>
            <div className="temp" onClick={() => setIsCelsius(!isCelsius)}>
              <h1>
                {convertTemp(data.main.temp)}°{isCelsius ? "C" : "F"}
              </h1>
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          <div className="bottom row justify-content-center">
            <div className="feels col-12 col-sm-4 text-center">
              <motion.div {...iconAnimation}>
                <Thermometer size={30} />
              </motion.div>
              {data.main && (
                <p className="bold">
                  {convertTemp(data.main.feels_like)}°{isCelsius ? "C" : "F"}
                </p>
              )}
              <p>Feels Like</p>
            </div>

            <div className="humidity col-12 col-sm-4 text-center">
              <motion.div {...iconAnimation}>
                <Droplet size={30} />
              </motion.div>
              {data.main && <p className="bold">{data.main.humidity}%</p>}
              <p>Humidity</p>
            </div>

            <div className="wind col-12 col-sm-4 text-center">
              <motion.div {...iconAnimation}>
                <Wind size={30} />
              </motion.div>
              {data.wind && (
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
              )}
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
