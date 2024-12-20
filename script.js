const apiKey = '92aa290424c774f25735596d3750c02c';
const baseUrl = 'http://api.weatherstack.com/';
const resultDiv = document.getElementById('result');

// Fetch current weather
document.getElementById('currentWeatherBtn').addEventListener('click', () => {
    const location = document.getElementById('location').value;
    if (!location) {
        resultDiv.innerHTML = '<p>Please enter a location.</p>';
        return;
    }
    const url = `${baseUrl}current?access_key=${apiKey}&query=${location}`;
    fetchWeather(url, displayCurrentWeather);
});

// Fetch historical weather
document.getElementById('historicalWeatherBtn').addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const date = prompt('Enter a date (YYYY-MM-DD):');
    if (!location || !date) {
        resultDiv.innerHTML = '<p>Please enter a location and date.</p>';
        return;
    }
    const url = `${baseUrl}historical?access_key=${apiKey}&query=${location}&historical_date=${date}`;
    fetchWeather(url, displayHistoricalWeather);
});

// Fetch forecast
document.getElementById('forecastBtn').addEventListener('click', () => {
    const location = document.getElementById('location').value;
    if (!location) {
        resultDiv.innerHTML = '<p>Please enter a location.</p>';
        return;
    }
    const url = `${baseUrl}forecast?access_key=${apiKey}&query=${location}`;
    fetchWeather(url, displayForecast);
});

// Generic fetch function
function fetchWeather(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p>Error: ${data.error.info}</p>`;
            } else {
                callback(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>Something went wrong. Try again later.</p>';
        });
}

// Display current weather
function displayCurrentWeather(data) {
    resultDiv.innerHTML = `
        <h2>Current Weather in ${data.location.name}, ${data.location.country}</h2>
        <p>Temperature: ${data.current.temperature}°C</p>
        <p>Weather: ${data.current.weather_descriptions[0]}</p>
        <p>Humidity: ${data.current.humidity}%</p>
    `;
}

// Display historical weather
function displayHistoricalWeather(data) {
    const date = Object.keys(data.historical)[0];
    const weather = data.historical[date];
    resultDiv.innerHTML = `
        <h2>Historical Weather on ${date} in ${data.location.name}</h2>
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Weather: ${weather.weather_descriptions[0]}</p>
        <p>Humidity: ${weather.humidity}%</p>
    `;
}

// Display forecast
function displayForecast(data) {
    const forecast = data.forecast;
    let forecastHTML = `<h2>Daily Forecast for ${data.location.name}</h2>`;
    Object.keys(forecast).forEach(date => {
        forecastHTML += `
            <p>${date}: Max Temp: ${forecast[date].maxtemp}°C, Min Temp: ${forecast[date].mintemp}°C</p>
        `;
    });
    resultDiv.innerHTML = forecastHTML;
}
