
//get API key
var Apikey = "324a506b2f6b0f1b44fde14916e4b006";
//get API images

//Function to get data from API and append it to result
function getweatherdata(city) {

    //pulling info from API
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + Apikey)
        .then(function (response) {
            console.log(response);
            return response.json();

        }).then(function (data) {
            console.log(data);
            //empty html before each fetch
            $("#city-result").empty();

            //Create weather elements    
            $("#city-result").append("<h3>"+ data.name +"</h3>")
            //get weather images. Big thanks to https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon for hinting the path!
            var weatherCode = data.weather[0].icon
                    console.log(weatherCode)
            var imageLink = "http://openweathermap.org/img/wn/" + weatherCode + "@2x.png"
                     console.log(imageLink)
            $("#city-result").append("<img id='weatherIcon' src=" + imageLink + ">");

            //get weather data.
            $("#city-result").append("<li>" + "Temperature: " + data.main.temp + " F" + "</li>");
            $("#city-result").append("<li>" + "Feels Like: " + data.main.feels_like + " F" + "</li>");
            $("#city-result").append("<li>" + "Min-Temp: " + data.main.temp_min + " F" + "</li>");
            $("#city-result").append("<li>" + "Max-Temp: " + data.main.temp_max + " F" + "</li>");

            //catching errors
        }).catch(function (error) {
            console.log("This an error message", error);
            return
        })

};
//getweatherdata(city) + getweatherdata('austin') === var city = 'austin'
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

        //$("#city-name").empty();
        //$("#city-name").append(city);
        getweatherdata(city);;
    }
})