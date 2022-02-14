const appID = "19d9e8edbfb9033389bbb97a8925fea8";
let currentCity = "";
let lastCity = "";

var handleErrors = (response) => {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

// Function to display current weather conditions
var currentWeather = (event) => {
  let city = $('#search-city').val();
  currentCity= $('#search-city').val();
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + appID;
  fetch(queryURL)
  .then(handleErrors)
  .then((response) => {
      return response.json();
  })
  .then((response) => {
      // Save city to local storage
      storeCity(city);
      $('#search-error').text("");
      let currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      // Offset UTC timezone - using moment.js
      let currentTimeUTC = response.dt;
      let currentTimeZoneOffset = response.timezone;
      let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
      let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
      recentCities();
      // Grabs five-day forecast of current city
      fiveDayForecast(event);
      $('#date-text').text(currentMoment.format("MM/DD/YYYY"));
      // Dynamically creates HTML for current weather conditions
      let currentWeatherHTML = `
          <h3>${response.name}</h3>
          <h3><img src="${currentWeatherIcon}"></h3>
          <h4>${response.main.temp}&#8457;</h4>
          <p class="five-list">
              <br />Feels like: ${response.main.feels_like}&#8457;
              <br />Humidity: ${response.main.humidity}%
              <br />Wind Speed: ${response.wind.speed} mph
              <br />High: ${response.main.temp_max}&#8457;
              <br />Low: ${response.main.temp_min}&#8457;
          </p>`;
      // Append the results to the DOM
      $('#current-weather').html(currentWeatherHTML);
  })
}

// Function to obtain the five day forecast and display to HTML
var fiveDayForecast = (event) => {
  let city = $('#search-city').val();
  // Set up URL for API search using forecast search
  let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + appID;
  // Fetch from API
  fetch(queryURL)
      .then (handleErrors)
      .then((response) => {
          return response.json();
      })
      .then((response) => {
      // Dynamically creates HTML of five-day forecast
      let fiveDayForecastHTML = `
      <h2>5-Day Forecast:</h2>
      <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
      // Loop over the 5 day forecast and build the template HTML using UTC offset and Open Weather Map icon
      for (let i = 0; i < response.list.length; i++) {
          let dayData = response.list[i];
          let dayTimeUTC = dayData.dt;
          let timeZoneOffset = response.city.timezone;
          let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
          let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
          let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
          // Only displaying mid-day forecasts
          if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
              fiveDayForecastHTML += `
              <div class="weather-card card m-2 g-4">
                  <ul class="list-unstyled p-3">
                      <li>${thisMoment.format("MM/DD/YYYY")}</li>
                      <li class="weather-icon"><img src="${iconURL}"></li>
                      <li>Temp: ${dayData.main.temp}&#8457;</li>
                      <li>Feels like: ${dayData.main.feels_like}&#8457;</li>
                      <li>Humidity: ${dayData.main.humidity}%</li>
                  </ul>
              </div>`;
          }
      }
      // Build the HTML template
      fiveDayForecastHTML += `</div>`;
      // Append the five-day forecast to the DOM
      $('#five-day-forecast').html(fiveDayForecastHTML);
  })
}

var storeCity = (newCity) => {
  let cityExists = false;
  // Check if City exists in local storage
  for (let i = 0; i < localStorage.length; i++) {
      if (localStorage["cities" + i] === newCity) {
          cityExists = true;
          break;
      }
  }
  if (cityExists === false) {
      localStorage.setItem('cities' + localStorage.length, newCity);
  }
}

// Render the list of searched cities
var recentCities = () => {
  $('#city-results').empty();
  // If localStorage is empty
  if (localStorage.length===0){
      if (lastCity){
          $('#search-city').attr("value", lastCity);
      } else {
          $('#search-city').attr("value", "San Francisco");
      }
  } else {
      // Build key of last city written to localStorage
      let lastCityKey="cities"+(localStorage.length-1);
      lastCity=localStorage.getItem(lastCityKey);
      // Set search input to last city searched
      $('#search-city').attr("value", lastCity);
      // Append stored cities to page
      for (let i = 0; i < localStorage.length; i++) {
          let city = localStorage.getItem("cities" + i);
          let cityEl;
          // Set to lastCity if currentCity not set
          if (currentCity===""){
              currentCity=lastCity;
          }
          // Set button class to active for currentCity
          if (city === currentCity) {
              cityEl = `<button type="button" class="list-group-item list-group-item-action btn-secondary active">${city}</button></li>`;
          } else {
              cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
          } 
          // Append city to page
          $('#city-results').prepend(cityEl);
      }
      // Add a "clear" button to page if there is a cities list
      if (localStorage.length>0){
          $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
      } else {
          $('#clear-storage').html('');
      }
  }
  
}

// button for searching for a new city
$('#search-button').on("click", (event) => {
  event.preventDefault();
  currentCity = $('#search-city').val();
  currentWeather(event);
  });
  
 // button when clicking on previous, recently searched cities
  $('#city-results').on("click", (event) => {
      event.preventDefault();
      $('#search-city').val(event.target.textContent);
      currentCity=$('#search-city').val();
      currentWeather(event);
  });
  
  // Clear old searched cities from localStorage event listener
  $("#clear-storage").on("click", (event) => {
      localStorage.clear();
      recentCities();
  });
  
  // Displays recently searched cities
  recentCities();
  
  // Gets current weather details as well as five-day forecast details
  currentWeather();

// function recentCities() {
//   $(".recent-input").empty();

//   for (var i = 0; i < searchInput.length; i++) {
//     var b = $("<button>");
//     b.addClass("btn btn-info w-100 mb-2 city-btn");
//     b.attr("data-name", searchInput[i]);
//     b.text(searchInput[i]);
//     $(".recent-input").replaceWith(b);
//   }
// }




