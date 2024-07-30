import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "./App.css"; // Ensure this path is correct

const App = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(moment().format("HH:mm:ss"));
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("New York"); // Default location
  const [inputLocation, setInputLocation] = useState(""); // For search input
  const [apiConnected, setApiConnected] = useState(false); // API connection status

  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                q: location,
                appid: "2480a0424964bb499a535c0231b05b8c",
                units: "metric",
              },
            }
          );
          setWeather(response.data);
          setApiConnected(true); // Set API connected status to true
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setApiConnected(false); // Set API connected status to false
        }
      }
    };

    fetchWeather();
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleSearch = () => {
    setLocation(inputLocation);
    setInputLocation("");
  };

  return (
    <div className="App">
      <h1>Calendar, Time, and Weather App</h1>
      <div className="calendar">
        <Calendar onChange={handleDateChange} value={date} />
      </div>
      <div className="time">
        <h2>Current Time: {time}</h2>
      </div>
      <div className="weather">
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button onClick={handleSearch}>Search</button>
        <div
          className={`status-dot ${
            apiConnected ? "connected" : "disconnected"
          }`}
        ></div>
        {weather ? (
          <div>
            <h2>Weather in {weather.name}</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Condition: {weather.weather[0].description}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
};

export default App;
