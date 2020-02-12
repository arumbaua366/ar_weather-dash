var searchInput = [];



$("#search-btn").on("click", function (event) {
    event.preventDefault();

    var searchCity = $("#search-txt").val();
    var appID = "19d9e8edbfb9033389bbb97a8925fea8"
    var mainQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + appID

    $.ajax({
        url: mainQueryURL,
        method: "GET"
    }).then(function (response) {

        $("current-city").text(response.name + " (" + response.sys.country + ")");
        $("#current-temp").text(response.main.temp + " F°");
        $("#current-humidity").text(response.main.humidity + "%");
        $("#current-wind-speed").text(response.wind.speed + " MPH");
        $("#current-uv-index").text(response.sys.id);
    
        var currentIcon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        $("#weather-icon").html("<img src=" + currentIcon + " class='current-icon' alt='weather-icon'></img>");
        
        fiveDayForecast(searchCity)
        searchInput.unshift(searchCity) // unshift() method adds the latest recent searches at the beginning of the "recent" array
        recentSearchBtns();
    });
});

$(document).on("click", ".city-btn", function (event) {

    event.preventDefault();

    var searchCity = $(this).attr("data-name");
    var appID = "19d9e8edbfb9033389bbb97a8925fea8"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + appID

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#current-city").text(response.name + " (" + response.sys.country + ")");
        $("#current-temp").text(response.main.temp + " F°");
        $("#current-humidity").text(response.main.humidity + "%");
        $("#current-wind-speed").text(response.wind.speed + " MPH");

        var currentDayIcon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        $("#weather-icon").html("<img src=" + currentDayIcon + " class='current-icon' alt='weather-icon'></img>");
        
        getUvIndex(response);

        fiveDayForecast(searchCity);
    })

});

function fiveDayForecast(searchCity) {

        var appID = "19d9e8edbfb9033389bbb97a8925fea8"
        var fiveDayQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + appID

        $.ajax({
            url: fiveDayQuery,
            method: "GET"
        }).then(function (response) {

            $(".day-one-title").text(moment.unix(response.list[7].dt).format("dddd"));
            $("#dayone-temp").text("Temp: " + response.list[7].main.temp + " F°");
            $("#dayone-humidity").text("Humidity: " + response.list[7].main.humidity + "%");
            const oneIcon = "https://openweathermap.org/img/wn/" + response.list[7].weather[0].icon + "@2x.png";
            $("#day-one-icon").html("<img src=" + oneIcon + " class='five-day-icon' alt='weather-icon'></img>");
            
            $(".day-two-title").text(moment.unix(response.list[15].dt).format("dddd"));
            $("#daytwo-temp").text("Temp: " + response.list[15].main.temp + " F°");
            $("#daytwo-humidity").text("Humidity: " + response.list[15].main.humidity + "%");
            const twoIcon = "https://openweathermap.org/img/wn/" + response.list[15].weather[0].icon + "@2x.png";
            $("#day-two-icon").html("<img src=" + twoIcon + " class='five-day-icon' alt='weather-icon'></img>");
            
            $(".day-three-title").text(moment.unix(response.list[23].dt).format("dddd"));
            $("#daythree-temp").text("Temp: " + response.list[23].main.temp + " F°");
            $("#daythree-humidity").text('Humidity: ' + response.list[23].main.humidity + '%');
            const threeIcon = "https://openweathermap.org/img/wn/" + response.list[23].weather[0].icon + "@2x.png";
            $("#day-three-icon").html("<img src=" + threeIcon + " class='five-day-icon' alt='weather-icon'></img>");
            
            $(".day-four-title").text(moment.unix(response.list[31].dt).format("dddd"));
            $("#dayfour-temp").text("Temp: " + response.list[31].main.temp + " F°");
            $("#dayfour-humidity").text("Humidity: " + response.list[31].main.humidity + "%");
            const fourIcon = "https://openweathermap.org/img/wn/" + response.list[31].weather[0].icon + "@2x.png";
            $("#day-four-icon").html("<img src=" + fourIcon + " class='five-day-icon' alt='weather-icon'></img>");
            
            $(".day-five-title").text(moment.unix(response.list[39].dt).format("dddd"));
            $("#dayfive-temp").text("Temp: " + response.list[39].main.temp + " F°");
            $("#dayfive-humidity").text("Humidity: " + response.list[39].main.humidity + "%");
            var fiveIcon = "https://openweathermap.org/img/wn/" + response.list[39].weather[0].icon + "@2x.png";
            $("#day-five-icon").html("<img src=" + fiveIcon + " class='five-day-icon' alt='weather-icon'></img>");

        })
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
        
        var lat = response.coord.lat
        var lon = response.coord.lon
    
        var appID = "19d9e8edbfb9033389bbb97a8925fea8"
        var fiveDayQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + appID
    
        $.ajax({
            url: uvQuery,
            method: "GET"
        }).then(function (response) {
            $("#current-uv-index").text(response.value);
        })
        
    } 
// function getForecastURL(icon){

//     var url = "";

//     switch(icon) {

//         case "01d":
//         case "01n":
//             url = "assets/img/sunny.png";
//             break;

//         case "02d":
//         case "02n":
//             url = "assets/img/sun-cloudy (1).png";
//             break;

//         case "03d":
//         case "03n":
//         case "04d":
//         case "04n":
//             url = "assets/img/cloud-cloudy.png";
//             break;

//         case "09d":
//         case "09n":
//         case "10d":
//         case "10n":
//             url = "assets/img/rain-cloudy.png";
//             break;

//         case "11d":
//         case "11n":
//             url = "assets/images/storm.png";
//             break;

//         case "13d":
//         case "13n":
//             url = "assets/img/cloudy-snow.png";
//             break;

//         case "50d":
//         case "50n":
//             url = "assets/img/sun-rain-cloudy.png";
//             break;
//     }

//     return url;
// }