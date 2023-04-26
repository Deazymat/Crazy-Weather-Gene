$(document).ready(function () {
  var APIKey = "c4df58c901cb6f151e85cb49888049e7";

  var southernTexasCitys = [
    { name: "Webster", lat: 29.5377, lon: -95.1183 },
    { name: "Lake Jackson", lat: 29.5377, lon: -95.1183 },
    { name: "Port Arthur", lat: 29.5377, lon: -95.1183 },
    { name: "Pasadena", lat: 29.5377, lon: -95.1183 },
    { name: "Nassau Bay", lat: 29.5377, lon: -95.1183 },
  ];

  function generateCityButtons() {
    southernTexasCitys.forEach(function (city) {
      var cityButton = $("<button>")
        .addClass("btn btn-outline-primary")
        .text(city.name)
        .data("lat", city.lat)
        .data("lon", city.lon)
.on("click" , function(event) {
var city = event.target.textContent 
displayHistoryWeather (city);


})
      var listItem = $("<li>").append(cityButton);
      $("#southern-texas-citys").append(listItem);
    });
  }

  function getWeatherForecast(lat, lon) {
    return $.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`
    );
  }
  function getCityCoordinates(cityName) {
    return $.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}&units=imperial`
    );
  }
function getCityWeather(cityName) {
  return $.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=imperial`
  );
}

function displayHistoryWeather (city) {

 getCityWeather(city).then(displayWeatherData);

}

  function displayWeatherData(data) {
    console.log(data);
    $("#forecast").html("");
    for (var i = 0; i < 5; i++) {
      var div = $("<div>").addClass("card");
       var date = $("<p>").text("date; " + data.list[i].dt_txt);
       div.append(date);
      var temp = $("<p>")
        .addClass("card-title")
        .text("temp; " + data.list[i].main.temp + "F");
      div.append(temp);
      var humidity = $("<p>").text(
        "humidity; " + data.list[i].main.humidity + "%"
      );
      div.append(humidity);

      var wind = $("<p>").text("wind; " + data.list[i].wind.speed + "mph");
      div.append(wind);

     

      var iconurl =
        "http://openweathermap.org/img/w/" +
        data.list[i].weather[0].icon +
        ".png";
      var img = $("<img>").attr("src", iconurl).addClass("icon");

      div.append(img);
      $("#forecast").append(div);
    }
  }

  function loadSearchHistory() {
    var searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      searchHistory.forEach(function (city) {
        var listItem = $("<li>")
          .on("click", function (event) {
            var city = event.target.textContent;
            displayHistoryWeather(city);
          })
          .text(city);
        $("#search-history").append(listItem);
      });
    } else {
      searchHistory = [];
    }
    return searchHistory;
  }

  function saveSearchHistory(searchHistory) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  var searchHistory = loadSearchHistory();

  generateCityButtons();

  $("#city-form").submit(function (event) {
    event.preventDefault();
    var cityName = $("#city-input").val();

    // if (cityName) {
    //   var city = southernTexasCitys.find(function (city) {
    //     return city.name.toLowerCase() === cityName.toLowerCase();
    //   });

    //   if (city) {
    //     getWeatherForecast(city.lat, city.lon).then(displayWeatherData);
    //   } else {
        getCityCoordinates(cityName)
          .done(function (cityData) {
            // console.log(cityData)
            var lat = cityData[0].lat;
            var lon = cityData[0].lon;

            getWeatherForecast(lat, lon).then(displayWeatherData);

            if (!searchHistory.includes(cityName)) {
              searchHistory.push(cityName);
              saveSearchHistory(searchHistory);
              var listItem = $("<li>").text(cityName);
              $("#search-history").append(listItem);
            }
          })
          .fail(function () {
            alert("Error: please try again");
          });
    //   }
    // }
  });
});
