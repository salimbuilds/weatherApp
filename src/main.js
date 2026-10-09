import './style.css'

const searchForm = document.getElementById("searchForm");
const search = document.getElementById("search");
const searchBtn  = document.getElementById("searchBtn");
const loadBox = document.getElementById("loadBox");
const resultBox = document.getElementById("resultBox");

const API_KEY = import.meta.env.VITE_WEATHER_KEY;


function showLoading(){
  loadBox.innerHTML = `

 <div class="px-2 py-px ring-1 ring-inset ring-brand-subtle text-fg-brand-strong text-xs font-medium rounded-sm bg-brand-softer animate-pulse">loading...</div>

`;
}


function errorMessage(message){
  loadBox.innerHTML = `<div class="flex items-start sm:items-center p-4 mb-4 text-sm text-fg-brand-strong rounded-base bg-brand-softer" role="alert">
  <svg class="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
  <p><span class="font-medium me-1"> </span>${message}</p>
</div>`;
}


async function getWeather(){

  const citySearched = search.value.trim();

  if(search.value.trim()===""){

    errorMessage("enter valid city");
    return;
  }
  showLoading();
  resultBox.textContent = "";


  try{

    

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(citySearched)}&units=metric&appid=${API_KEY}`);

    if(!res.ok){
      if(res.status===404) throw new Error("city not found");
      if(res.status===401) throw new Error("invalid api key");
      throw new Error("server error: " + res.status);
    }


    const data = await res.json();
    loadBox.textContent = "";
    showData(data);


  }
catch(e){

  errorMessage(e.message);

}



}


const emojis = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
  Smoke: "🌫️",
  Dust: "🌫️",
};





function showData(data){
 const weather = data.weather[0];
  const icon =emojis[weather.main] || "🌡️"; 

  resultBox.innerHTML = `
    <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-md text-center">
      <div class="text-8xl my-2" role="img" aria-label="${weather.description}">${icon}</div>
      <h2 class="text-2xl font-bold">${data.name}, ${data.sys.country}</h2>
      <p class="text-6xl font-bold my-3">${Math.round(data.main.temp)}°C</p>
      <p class="capitalize text-gray-600">${weather.description}</p>

      <div class="grid grid-cols-3 gap-2 mt-6 text-sm">
        <div class="p-3 bg-sky-50 rounded-lg">
          <p class="text-gray-500">Feels like</p>
          <p class="font-semibold">${Math.round(data.main.feels_like)}°C</p>
        </div>
        <div class="p-3 bg-sky-50 rounded-lg">
          <p class="text-gray-500">Humidity</p>
          <p class="font-semibold">${data.main.humidity}%</p>
        </div>
        <div class="p-3 bg-sky-50 rounded-lg">
          <p class="text-gray-500">Wind</p>
          <p class="font-semibold">${data.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  `;



}

searchForm.addEventListener("submit",(event)=>{
  event.preventDefault();

getWeather();

})