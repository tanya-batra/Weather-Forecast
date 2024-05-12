const forecastContainer = document.querySelector(".day-forecast");
const inputBox = document.getElementById("input-box");
const cityInput = document.getElementById("city-input");
const cities = document.querySelectorAll(".city");


// Event listener for form submission
inputBox.addEventListener("submit", function(event) {
    event.preventDefault(); // Preventing default form submission behavior
    const city = cityInput.value.trim(); 
    if (city !== "") {
        fetchWeatherData(city); 
        fetchForecastData(city); // Fetch 5-day forecast data for the entered city
    }
});

// Function to fetch weather data for a given city
function fetchWeatherData(city) {
    const apiKey = '703d373859cd47b9b0a124753241105';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update DOM with weather information
            updateWeatherInfo(data);
            return data ;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
cities.forEach(city => {
    city.addEventListener('click', async () => { 
        const cityName = city.textContent;
        try {
            const weatherData = await fetchWeatherData(cityName); 
            document.getElementById('weather').textContent = `Weather data for ${cityName}: ${weatherData.current.condition.text}`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    });
});

// Function to fetch 5-day forecast data for a given city
function fetchForecastData(city) {
    const apiKey = '703d373859cd47b9b0a124753241105';
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Function to update DOM with weather information
function updateWeatherInfo(data) {
    const tempElement = document.querySelector(".temp");
    const nameElement = document.querySelector(".name");
    const timeElement = document.querySelector(".time");
    const dateElement = document.querySelector(".date");
    const conditionElement = document.querySelector(".condition");

    tempElement.innerHTML = data.current.temp_c + "&#176;";
    nameElement.textContent = data.location.name;
    conditionElement.textContent = data.current.condition.text;

    // Assuming 'localtime' format is "YYYY-MM-DD HH:MM"
    const [date, time] = data.location.localtime.split(" ");
    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");

    const formattedDate = new Date(year, month - 1, day);
    const weekday = formattedDate.toLocaleString("en-us", { weekday: "long" });

    dateElement.textContent = `${weekday}, ${day}/${month}/${year}`;
    timeElement.textContent = `${hour}:${minute}`;
}


// Function to update DOM with 5-day forecast information
function updateForecast(data) {
    forecastContainer.innerHTML = ""; // Clear previous forecast data

    // Iterate over forecast data for each day
    data.forecast.forecastday.forEach(day => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-items");

        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("icon-wrapper");
        const icon = document.createElement("img");
        icon.src = day.day.condition.icon;
        icon.alt = day.day.condition.text;
        icon.width = 30;
        iconWrapper.appendChild(icon);

        const temperature = document.createElement("span");
        temperature.innerHTML = `${day.day.avgtemp_c}&#176;C`;

        forecastItem.appendChild(iconWrapper);
        forecastItem.appendChild(temperature);

        forecastContainer.appendChild(forecastItem);
    });
}
