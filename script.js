$(document).ready(function () {
  var APIKey = "c4df58c901cb6f151e85cb49888049e7";

  var southernTexasCitys = [
    { name: "Webster Texas", lat: 29.5377, lon: -95.1183 },
    { name: "Lake Jackson Texas", lat: 29.5377, lon: -95.1183 },
    { name: "Port Arthur Texas", lat: 29.5377, lon: -95.1183 },
    { name: "Pasadena Texas", lat: 29.5377, lon: -95.1183 },
    { name: "Nassau Bay Texas", lat: 29.5377, lon: -95.1183 },
  ];

  function generateCityButtons() {
    southernTexasCitys.forEach(function (city) {
      var cityButton = $("<button>")
        .addClass("btn btn-outline-primary")
        .text(city.name)
        .data("lat", city.lat)
        .data("lon", city.lon);

      var listItem = $("<li>").append(cityButton);
      $("#southern-texas-citys").append(listItem);
    });
  }

  function getWeatherForecast(lat, lon) {
    return $.get(
      "https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}"
  );
  }
function getCityCoordinates(cityName) {
    return $.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`
    );
  }

  function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }

  function displayWeatherData(data) {
    console.log(data);
  }


  function loadSearchHistory() {
    var searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      searchHistory.forEach(function (city) {
        var listItem = $("<li>").text(city);
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

  if (cityName) {
    var city = southern-texas-citys.find(function (city) {
      return city.name.toLowerCase() === cityName.toLowerCase();
    });

    if (city) {
      getWeatherForecast(city.lat, city.lon).then(displayWeatherData);
    } else {
      getCityCoordinates(cityName)
        .done(function (cityData) {
          var lat = cityData.coord.lat;
          var lon = cityData.coord.lon;

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
    }
    }
  });
});