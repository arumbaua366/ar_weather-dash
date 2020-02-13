var searchInput = [];

$("#search-btn").on("click", function(event) {
  event.preventDefault();

  var searchCity = $("#search-txt").val();
  searchCityWeather(searchCity);
});

$(document).on("click", ".city-btn", function(event) {
  event.preventDefault();

  var searchCity = $(this).attr("data-name");
  searchCityWeather(searchCity);

});

function searchCityWeather(searchCity) {
  var appID = "19d9e8edbfb9033389bbb97a8925fea8";
  var mainQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchCity +
    "&units=imperial&appid=" +
    appID;

  $.ajax({
    url: mainQueryURL,
    method: "GET"
  }).then(function(response) {
      
    $("#current-city").text(response.name + " (" + response.sys.country + ")");
    $("#current-temp").text(response.main.temp + " F°");
    $("#current-humidity").text(response.main.humidity + "%");
    $("#current-wind-speed").text(response.wind.speed + " MPH");
    $("#current-uv-index").text(response.sys.id);

    var currentIcon =
      "http://openweathermap.org/img/wn/" +
      response.weather[0].icon +
      "@2x.png";
    $("#weather-icon").html(
      "<img src=" +
        currentIcon +
        " class='current-icon' alt='weather-icon'></img>"
    );

    fiveDayForecast(searchCity);
    searchInput.unshift(searchCity); // unshift() method adds the latest recent searches at the beginning of the "recent" array
    recentSearchBtns();
  });
}

function fiveDayForecast(searchCity) {
  var appID = "19d9e8edbfb9033389bbb97a8925fea8";
  var fiveDayQuery =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchCity +
    "&units=imperial&appid=" +
    appID;
  console.log(fiveDayQuery);

  $.ajax({
    url: fiveDayQuery,
    method: "GET"
  }).then(function(response) {
    
    for (var i = 0; i < response.list.length; i++) {
      var time = response.list[i].dt_txt.split(" ");
      console.log(time);
      if (time[1] === "12:00:00") {
        var fiveIcon =
        "https://openweathermap.org/img/wn/" +
        response.list[i].weather[0].icon +
        "@2x.png";
        var cardWeather = `
            <div class="col mb-4">
            <div class="card shadow-lg p-3 mb-5 bg-transparent hide">
                <p class="day-image"></p>
                <div class="card-body">
                    <h5 class="title">${moment
                      .unix(response.list[i].dt)
                      .format("dddd")}</h5>
                    <div class=""></div>
                    <img src=${fiveIcon} class='five-day-icon' alt='weather-icon'></img>
                    <p class="">Temp: <span>${response.list[i]
                      .main.temp + " F°"}</span></p>
                    <p class="">Humidity: ${response
                      .list[i].main.humidity + "%"}</p>
                      
                </div>
            </div>
        </div>`;

        $("#forecastWeather").append(cardWeather);
      }
    }
  });
}

function recentSearchBtns() {
  $(".recent-input").empty();

  for (var i = 0; i < searchInput.length; i++) {
    var b = $("<button>");
    b.addClass("btn btn-info w-100 mb-2 city-btn");
    b.attr("data-name", searchInput[i]);
    b.text(searchInput[i]);
    $(".recent-input").append(b);
  }
}

function getUvIndex(response) {
  var lat = response.coord.lat;
  var lon = response.coord.lon;

  var appID = "19d9e8edbfb9033389bbb97a8925fea8";
  var fiveDayQuery =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchCity +
    "&units=imperial&appid=" +
    appID;

  $.ajax({
    url: uvQuery,
    method: "GET"
  }).then(function(response) {
    $("#current-uv-index").text(response.value);
  });
}


// LOGIC



//inlude   (string)
//indexOf  (array)  array.indexOf(searchcity) ==== -1{ then push}