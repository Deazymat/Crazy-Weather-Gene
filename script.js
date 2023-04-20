$(document).ready(function () {
  var APIKey = "07a6f130181d06422d27a7ea858ae897";

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
      $("#predefined-cities").append(listItem);
    });
  }

  function getWeatherForecast(lat, lon) {
    return $.get(
      "https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}"
    );
  }
  function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }

  function displayWeatherData(data) {
    console.log(data);
  }

  generateCityButtons();

  $("#predefined-cities").on("click", "button", function () {
    var lat = $(this).data("lat");
    var lon = $(this).data("lon");

    getWeatherForecast(lat, lon).then(displayWeatherData);
  });

  $("#city-form").submit(function (event) {
    event.preventDefault();
    var cityName = $("#city-input").val();

    if (cityName) {
      getCityCoordinates(cityName)
        .done(function (cityData) {
          var lat = cityData.coord.lat;
          var lon = cityData.coord.lon;

          getWeatherForecast(lat, lon).then(displayWeatherData);
        })
        .fail(function () {
          alert("Error: please try again");
        });
    }
  });
});


















































