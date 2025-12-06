const input = document.querySelector('#cityInput');
const inputForm = document.querySelector('#inputForm');
const searchBtn = document.querySelector('#searchBtn');

const cityNameEl = document.querySelector('#cityName');
const temp = document.querySelector('#temp');
const desc = document.querySelector('#desc');

const notFoundMsg = document.querySelector('#notFoundMsg');
const weatherBox = document.querySelector('#weatherBox');

const API_KEY = '83eca8feadbfb77f451ae80b753d9de2';

async function getWeatherInfo(e) {
    e.preventDefault();

    const city = input.value.trim();
    
    if (!city) {
        notFoundMsg.textContent = "Please enter a city name!!";
        notFoundMsg.classList.remove("hidden");
        weatherBox.classList.add("hidden");
        return;
    }

    searchBtn.textContent = "Searching...";
    searchBtn.disabled = true;
    notFoundMsg.classList.add('hidden');

    try {
        const data = await fetchWeather(city);
        if (data.cod == "404" || data.cod == 404) {
            showNotFound();
            console.log("Not found")
        } else {
            updateUI(data);
        }
    } catch (error) {
        console.log(error);
        notFoundMsg.textContent = "Something went wrong. Try again later";
        notFoundMsg.classList.remove("hidden");
        weatherBox.classList.add("hidden");
    } finally {
        searchBtn.textContent = "Search";
        searchBtn.disabled = false;
    }
}

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);

    const data = await res.json();
    console.log(data)
    return data;
}

function updateUI(data) {
    const cityName = `${data.name}, ${data.sys.country}`;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;

    cityNameEl.textContent = cityName;
    temp.textContent = `${temperature}°C`;
    desc.textContent = description.charAt(0).toUpperCase() + description.slice(1);

    weatherBox.classList.remove('hidden');
    notFoundMsg.classList.add('hidden');
}

function showNotFound() {
    weatherBox.classList.add("hidden");
    notFoundMsg.textContent = "city not found!!";
    notFoundMsg.classList.remove("hidden");
}

inputForm.addEventListener('submit', getWeatherInfo);