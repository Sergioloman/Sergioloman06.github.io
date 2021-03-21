var Apikey = "324a506b2f6b0f1b44fde14916e4b006";

//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//make an account to open weather app


//get weather data from any city!

function getweatherdata(city){

    //var city = 'austin'
    //function get weatherdata (city)
    //get weatherdata (austin)
    //we will need to write a fetch request
    fetch("https://api.openweathermap.org/data/2.5/weather?q=austin&units=imperial&appid"+ Apikey)
    .then(function(response){
        console.log(response);
        return response.json();
    }).then(function(data){
        // 
        //var farenheith = (data.main.temp - 274/15)*9/5 + 32;
        $("#city-result").empty();
        $("#city-result").append("<li>" + data.main.temp + "</li>");
        //console.log d(ata)
    });

}
//this will be our default value when app loads
getweatherdata('austin');



$("#submit").on("click", function(){
    var city = $("#city").val().trim();
    getweatherdata(city);
})