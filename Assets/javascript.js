var Apikey = "324a506b2f6b0f1b44fde14916e4b006";

//Function to get data from API and append it to result
function getweatherdata(cityName) {

    //pulling info from API
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + Apikey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //empty html before each fetch
            $("#current-weather").empty();

            //Create weather elements    

            //Current City and Date
            var currentDate = new Date(data.dt * 1000).toLocaleDateString();
            $("#current-weather").append("<h3>" + data.name + " " + currentDate +"</h3>")

            //get weather images. Big thanks to https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon for hinting the path!
            var weatherCode = data.weather[0].icon
            var imageLink = "http://openweathermap.org/img/wn/" + weatherCode + "@2x.png"
            $("#current-weather").append("<img id='weatherIcon' src=" + imageLink + ">");

            //get weather data
            $("#current-weather").append("<h6>" + data.weather[0].description + "</h6><br>");
            $("#current-weather").append("<li>" + "Temperature: " + data.main.temp + " °F" + "</li>");
            $("#current-weather").append("<li>" + "Humidity: " + data.main.humidity + " %" + "</li>");
            $("#current-weather").append("<li>" + "Wind Speed: " + data.wind.speed + " MPH" + "</li>");

            //fetch latitude and longitude( needed for the next call)
            var latitude = data.coord.lat
            var longitude = data.coord.lon

            //chain a 5 day forecast to the original request after selecting the target cityName
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + Apikey);
        })
        .then(function (response2) {
            return response2.json()
        })
        .then(function (data2) {

            //append UV index from data2 to current weather.   
            $("#current-weather").append("<li>" + "UV Index: " + "<span id='uv'> " + data2.daily[0].uvi + " </span>" + "</li>");
            function colorUV() {
                var uvIndex = data2.daily[0].uvi
                //create color badges to indicate UV conditions
                if (uvIndex <= 2) {
                    //favorable conditions
                    $("#uv").addClass('badge rounded-pill bg-primary');
                }
                else if (uvIndex <= 7) {
                    //moderate conditions
                    $("#uv").removeClass('badge rounded-pill bg-primary');
                    $("#uv").addClass('badge rounded-pill bg-warning')
                }
                else {
                    //severe conditions
                    $("#uv").removeClass('badge rounded-pill bg-warning')
                    $("#uv").removeClass('badge rounded-pill bg-primary');
                    $("#uv").addClass('badge rounded-pill bg-danger')
                }
                    //sources : https://www.epa.gov/sites/production/files/documents/uviguide.pdf
            } colorUV()

            //get weekly weather

            //empty target html container
            $('#daily-weather').empty();

            //get data for the next 5 days - iterate
            var dailyWeather = data2.daily
            for (var i = 1; i <= 6; i++) {

                //temperature icon
                var dailyWeatherCode = dailyWeather[i].weather[0].icon;
                var dailyImageLink = "http://openweathermap.org/img/wn/" + dailyWeatherCode + "@2x.png";
                var Icon = $("<img>").attr('src', dailyImageLink).addClass("card-img-top");
                //date and format it to MMDDYYY
                var Dte = $("<h5>").addClass("card-title text-center p-2").text(new Date(dailyWeather[i].dt * 1000).toLocaleDateString());
                //weather conditions
                var Condition = $("<li>").addClass("list-group-item p-2 h6").text(dailyWeather[i].weather[0].description);
                //Max and Min temps
                var Min = $("<li>").addClass("list-group-item p-2").text("Low : " + dailyWeather[i].temp.min + " °F")
                var Max = $("<li>").addClass("list-group-item p-2").text("High : " + dailyWeather[i].temp.max + " °F")
                //humidity
                var Humidity = $("<li>").addClass("list-group-item p-2").text("Humidity : " + dailyWeather[i].humidity + " %");
                //create bootstrap card element, append variables above
                $("#daily-weather").append(Card);
                var Ul = $("<ul>").addClass("list-group list-group-flush").append(Condition, Min, Max, Humidity);
                var Body = $("<div>").addClass("card-body p-2").append(Ul);
                var Card = $("<div>").addClass("card").attr("style", "width: 11rem;").append(Dte, Icon, Body);
            }
        })
        .catch(function (error) {
            alert("oh no! data not found :( ... ", error);
            return
        })
};
//Make Austin our defaul value when startup
getweatherdata('Austin');

var cityList = JSON.parse(localStorage.getItem('City')) || [];

//create buttons for previous searches
function renderCities(cityList) {
    //empty html container
    $('#cities').empty()

    //create a new Li for each city name
    for (var i = 0; i < 6; i++) {
        var cityName = $("<li>").addClass("list-group-item list-group-item-action p-2 h6 cityHistory").text(cityList[i])
        $('#cities').append(cityName);
    }

    //enable click function to each newly created item
    $(".cityHistory").click(function () {
        var history = $(this).text()
        getweatherdata(history);
    })
}

//search function
$("#submit").on("click", function (event) {
    event.preventDefault();

    var city = $("#form1").val().trim();
    cityList.unshift(city);

    //add each search to our local storage ( max array size to six items using slice() )
    if (cityList.length > 6) {
        cityList = cityList.slice(0, 6)
        localStorage.setItem('City', JSON.stringify(cityList))
    }
    
    //run our functions using search value
    $('#form1').val("")
    getweatherdata(city);
    renderCities(cityList);
})
renderCities(cityList)





