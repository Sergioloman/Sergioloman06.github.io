var Apikey = "324a506b2f6b0f1b44fde14916e4b006";
var currentDate = new Date()
console.log(currentDate)

//Function to get data from API and append it to result
function getweatherdata(city) {

    //pulling info from API
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + Apikey)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            //empty html before each fetch
            $("#current-weather").empty();

            //Create weather elements    
            $("#current-weather").append("<h3>" + data.name + "</h3>")

            //get weather images. Big thanks to https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon for hinting the path!
            var weatherCode = data.weather[0].icon
            var imageLink = "http://openweathermap.org/img/wn/" + weatherCode + "@2x.png"
            $("#current-weather").append("<img id='weatherIcon' src=" + imageLink + ">");

            //get weather data.
            $("#current-weather").append("<li>" + data.weather[0].description + "</li><br>");
            $("#current-weather").append("<li>" + "Temperature: " + data.main.temp + " °F" + "</li>");
            $("#current-weather").append("<li>" + "Min-Max: " + data.main.temp_min + " °F" + " - " + data.main.temp_max + " °F" + "</li>");
            $("#current-weather").append("<li>" + "Humidity: " + data.main.humidity + " %" + "</li>");
            $("#current-weather").append("<li>" + "Wind Speed: " + data.wind.speed + " MPH" + "</li>");
            
            //fetch latitude and longitude( needed for the next call)
            var latitude = data.coord.lat
            var longitude = data.coord.lon
            
            //chain a 5 day forecast to the original request after selecting the target city
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + Apikey);
        })
        .then(function (response2) {
            console.log(response2)
            return response2.json()
        })
        .then(function (data2) {
            console.log(data2)

            //append UV index  from data 2 to data1 fields    
            $("#current-weather").append("<li>" + "UV Index: " + data2.daily[0].uvi + "</li>");
            
            //empty target html container
            $('#daily-weather').empty();
            
            //daily weather temperature array
            var dailyWeather = data2.daily
            console.log(dailyWeather);
            
            //get data for the next 5 days
            for ( var i= 1; i <= 6 ; i++){
                                
                //temperature icon
                var dailyWeatherCode = dailyWeather[i].weather[0].icon;
                var dailyImageLink = "http://openweathermap.org/img/wn/" + dailyWeatherCode + "@2x.png";
                var Icon =  $("<img>").attr('src', dailyImageLink ).addClass("card-img-top");
                
                //date and format it to MMDDYYY
                var Dte = $("<h5>").addClass("card-title").text(new Date(dailyWeather[i].dt*1000).toLocaleDateString());
                //weather conditions
                var Condition = $("<li>").addClass("list-group-item p-3").text( dailyWeather[i].weather[0].description);
                //Max and Min temps
                var Minmax = $("<li>").addClass("list-group-item p-3").text("Min-Max : "+ dailyWeather[i].temp.min +" °F" + " - " + dailyWeather[i].temp.max + " °F")
                //humidity
                var Humidity = $("<li>").addClass("list-group-item p-3").text("Humidity : " + dailyWeather[i].humidity + " %");
                
                //create div containers
                $("#daily-weather").append(Card);
                
                var Body = $("<div>").addClass("card-body p-2").append(Dte,Condition,Minmax,Humidity);
                var Card = $("<div>").addClass("card").attr("style", "width: 9rem;").append(Icon,Body);
            }
        })
        .catch(function (error) {
            // set up so there is a default value//set city to be Austin and triger getweather.
            // plus the console log along with a pop up error message.
            //how to prevent an error? or return the user to the default value?
            console.log("oh no! This an error message... ", error);
            return
        })
};
//Make Austin the default value when app loads
getweatherdata('Austin');

//Enable submit click
$("#submit").on("click", function () {

    var city = $("#form1").val().trim();
    if (city === "" || city === Number) {
        //Prevent empty responses when clicking

        console.log("You did not type the name of a city")
        return
    } else {
        getweatherdata(city);;
    }
});


