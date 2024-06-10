
function formatDate(timestamp, timezone = null) {
  const localtime = new Date(timestamp);
  const offset = localtime.getTimezoneOffset();
  const date1 = new Date(localtime);
  date1.setSeconds(date1.getSeconds() + timezone);
  const date = new Date(date1.getTime() + offset * 60 * 1000);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[date.getDay()];
  const dayNumber = date.getDate();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  if (hours < 10) {
    hours = `0${hours}`;
  }

  const h2 = document.querySelector("h2");

  if ((hours >= 7 && ampm === "PM") || (hours < 6 && ampm === "AM") || (hours === 12 && ampm === "AM")) {
    document.querySelector("#city-input").classList.add("nightmode");
    document.querySelector("#search-button").classList.add("nightmode");
    document.querySelector("#location-button").classList.add("nightmode");
    document.querySelector("#location-icon").setAttribute("src", `Assets/icons/location-dark.svg`);
    document.body.classList.add("nightmode");
    document.querySelector(".weather-forecast").classList.add("nightmode");
    document.querySelector(".weather-app").classList.add("nightmode");
  } else {
    document.querySelector("#city-input").classList.remove("nightmode");
    document.querySelector("#search-button").classList.remove("nightmode");
    document.querySelector("#location-button").classList.remove("nightmode");
    document.querySelector("#location-icon").setAttribute("src", `Assets/icons/location-light.svg`);
    document.body.classList.remove("nightmode");
    document.querySelector(".weather-forecast").classList.remove("nightmode");
    document.querySelector(".weather-app").classList.remove("nightmode");
  }

  h2.innerHTML = `${day}, ${dayNumber} ${month} ${year} | ${hours}:${minutes} ${ampm}`;
}


function displayTemperature(response) {
  const temperatureElement = document.querySelector("#temperature");
  const cityElement = document.querySelector("#city-name");
  const descriptionElement = document.querySelector("#weather-description");
  const feelsLikeElement = document.querySelector("#feels-like");
  const humidityElement = document.querySelector("#humidity-level");
  const windElement = document.querySelector("#wind-speed");
  const iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  formatDate(response.data.dt * 1000, response.data.timezone);

  const iconMap = {
    "01d": "Assets/icons/01d.svg",
    "01n": "Assets/icons/01n.svg",
    "02d": "Assets/icons/02d.svg",
    "02n": "Assets/icons/02n.svg",
    "03d": "Assets/icons/03d.svg",
    "03n": "Assets/icons/03n.svg",
    "04d": "Assets/icons/04d.svg",
    "04n": "Assets/icons/04n.svg",
    "09d": "Assets/icons/09d.svg",
    "09n": "Assets/icons/09n.svg",
    "10d": "Assets/icons/10d.svg",
    "10n": "Assets/icons/10n.svg",
    "11d": "Assets/icons/11d.svg",
    "11n": "Assets/icons/11n.svg",
    "13d": "Assets/icons/13d.svg",
    "13n": "Assets/icons/13n.svg",
    "50d": "Assets/icons/50d.svg",
    "50n": "Assets/icons/50n.svg",
  };

  const iconSrc = iconMap[response.data.weather[0].icon] || "Assets/icons/01d.svg";
  iconElement.setAttribute("src", iconSrc);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getDailyForecast(response.data.coord);
}

function formatDays(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = date.getDay();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return days[day];
}

function displayForecast(response) {
  const forecast = response.data.daily;
  const forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach((forecastDay, index) => {
    if (index < 5) {
      const iconMap = {
        "01d": "Assets/icons/01d.svg",
        "01n": "Assets/icons/01n.svg",
        "02d": "Assets/icons/02d.svg",
        "02n": "Assets/icons/02n.svg",
        "03d": "Assets/icons/03d.svg",
        "03n": "Assets/icons/03n.svg",
        "04d": "Assets/icons/04d.svg",
        "04n": "Assets/icons/04n.svg",
        "09d": "Assets/icons/09d.svg",
        "09n": "Assets/icons/09n.svg",
        "10d": "Assets/icons/10d.svg",
        "10n": "Assets/icons/10n.svg",
        "11d": "Assets/icons/11d.svg",
        "11n": "Assets/icons/11n.svg",
        "13d": "Assets/icons/13d.svg",
        "13n": "Assets/icons/13n.svg",
        "50d": "Assets/icons/50d.svg",
        "50n": "Assets/icons/50n.svg",
      };

      const iconSrc = iconMap[forecastDay.weather[0].icon] || "Assets/icons/01d.svg";
      const maxTemp = Math.round(forecastDay.temp.max);
      const minTemp = Math.round(forecastDay.temp.min);

      forecastHTML += `
        <div class="col weekdays">
          <h4>${formatDays(forecastDay.dt)}</h4>
          <img src="${iconSrc}" alt="${forecastDay.weather[0].description}" class="weekday-weather" />
          <p class="forecast-temp">
            <span class="forecast-temp-max">${maxTemp}°</span> -
            <span class="forecast-temp-min">${minTemp}°</span>
          </p>
          <p class="weather-type">${forecastDay.weather[0].description}</p>
        </div>
      `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function handleSubmit(event) {
  event.preventDefault();
  const cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}


function search(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function saveLocation(position) {
  const location = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  localStorage.setItem("savedLocation", JSON.stringify(location));
}

function getSavedLocation() {
  const savedLocation = localStorage.getItem("savedLocation");
  if (savedLocation) {
    return JSON.parse(savedLocation);
  }
  return null;
}

function loadWeather() {
  const savedLocation = getSavedLocation();
  if (savedLocation) {
    getWeatherByCoordinates(savedLocation.lat, savedLocation.lon);
  } else {
    const newDelhiCoordinates = { lat: 28.6139, lon: 77.2090 };
    getWeatherByCoordinates(newDelhiCoordinates.lat, newDelhiCoordinates.lon);
  }
}

function getDailyForecast(coordinates) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${config.apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getWeatherByCoordinates(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  saveLocation(position);
  getWeatherByCoordinates(lat, lon);

}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  const temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  const fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  const temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

const form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

const currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", getLocation);

const fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

const celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

loadWeather();