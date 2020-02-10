var searchInput = [];

function displayWeatherInfo () {
    event.preventDefault();

    var searchCity = $("#search-txt").val();
    var appID = "19d9e8edbfb9033389bbb97a8925fea8"
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&appid=" + appID

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("current-city").text(response.name + "(" + response.sys.country + ")");
        $("#current-temp").text(response.main.temp + " F°");
        $("#current-humidity").text(response.main.humidity + "%");
        $("#current-wind-speed").text(response.wind.speed + " MPH");
        $("#current-uv-index").text(response.sys.id);

        var currentIcon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        $("#weather-icon").html('<img src=' + currentIcon + ' class="current-icon" alt="Weather icon"></img>');

        fiveDayForecast(searchInput);
        recentSearch.unshift(searchInput);
        renderButtons();
    })
}

function getForecastURL(icon){

    var url = "";

    switch(icon) {

        case "01d":
        case "01n":
            url = "assets/img/sunny.png";
            break;

        case "02d":
        case "02n":
            url = "assets/img/sun-cloudy (1).png";
            break;

        case "03d":
        case "03n":
        case "04d":
        case "04n":
            url = "assets/img/cloud-cloudy.png";
            break;

        case "09d":
        case "09n":
        case "10d":
        case "10n":
            url = "assets/img/rain-cloudy.png";
            break;

        case "11d":
        case "11n":
            url = "assets/images/storm.png";
            break;

        case "13d":
        case "13n":
            url = "assets/img/cloudy-snow.png";
            break;

        case "50d":
        case "50n":
            url = "assets/img/sun-rain-cloudy.png";
            break;
    }

    return url;
}