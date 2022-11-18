// an array to hold the top 10 cities checked for localStorage
var theCityArray = new Array();
//link to element city button in the Dom using id
var cityBtnEl = $('.cityButton');
//link to element search button in the Dom using id
var searchBtnEl = $('#searchBtn');
// link to city button elements section in Dom
var cityBtnSectionEl = $('#buttonSection');
//global variable to hold lat
var cityLat;
//global variable to hold lon
var cityLon;
//key for API
const apiKey = "7b5031efd51fb04c52651f1ab0b416b0";



//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7b5031efd51fb04c52651f1ab0b416b0
// [5 Day Weather Forecast](https://openweathermap.org/forecast5)


//initialize the page
function init(){
    //FIXME:if saved cities load them buttons on left - but weather should load blank
   loadCityBtns();
}

function validateCity(cityName){
    //call string for city to get lat and lon
    var callStringCity = ("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid="+apiKey);
    fetch(callStringCity)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
        if(data.length == 0){
            cityLat = null;
            cityLon = null;
        }else{
        console.log(data);
        cityLat=data[0].lat;
        cityLon=data[0].lon;
        console.log(cityLat);
        console.log(cityLon);
        }
    })
    .then(function(){ 
        if(cityLat == null){
            //do nothing if can't search
            alert(cityName+" is not a searchable city. Please try again.");
        }else{ 
            loadWeather();   
            var indexNum;
            var contains = false; 
            theCityArray = JSON.parse(localStorage.getItem("myCityArray"));
            if(theCityArray == null || theCityArray == 'undefined'){
            //if no items yet can't have lenght?
            theCityArray = [cityName];
            }else {
                for(var i = 0; i < theCityArray.length; i++){
                    //don't check case sensitive
                    if(theCityArray[i].toLowerCase()==cityName.toLowerCase()){
                    indexNum = i;
                    contains = true; 
                    }
                }
                if(contains){ 
                    //if the array already includes the City move it to front
                    theCityArray.splice(indexNum,1);
                    theCityArray.unshift(cityName);
                }else if(theCityArray.length < 10){
                    //just need to add
                    theCityArray.unshift(cityName);
                }else{
                    //remove from end and add to front so load in order on buttons with newest on top
                    theCityArray.pop();
                    theCityArray.unshift(cityName);
                }
            }
            //set updated array in storage
            localStorage.setItem("myCityArray", JSON.stringify(theCityArray)); 
            //reload buttons with new city name after reset array
            loadCityBtns();
        }
    });
}

function loadCityBtns(){
    //try and get cities from storage
    theCityArray = JSON.parse(localStorage.getItem("myCityArray"));
     //check if array existed already if so can load cities 
     //make sure on start up or new browser there are stored cities to work with
    if(theCityArray !== null && theCityArray !== 'undefined'){
        for(var i = 0; i<theCityArray.length;i++){
            //create/append a city button 
        var name ="#"+i+"Btn";
        var cityButtonEl = $(name);
        cityButtonEl.show();
        cityButtonEl.html(theCityArray[i]);

        }
    //TODO:if buttons made only change text otherwise make buttons if button id does not exist for index yet make it. 
    //TODO:up to 10 buttons make a button with id of saved city array index to look up city from storage and set text when change
    //TODO:after 10 buttons just change text
    }
}

function loadWeather(){
    console.log(cityLat+ " lat in load");
    console.log(cityLon +" lon in load");

    var callStringWeatherToday = ("https://api.openweathermap.org/data/2.5/weather?lat="+cityLat+"&lon="+cityLon+"&units=imperial&&appid="+apiKey);
   
    fetch(callStringWeatherToday)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("this is the weather today data");
    console.log(data);
    //load todays weather
    var iconUrl = "https://openweathermap.org/img/wn/"+data.weather[0].icon +".png";
    
    $('#cityName').text(data.name+ " "+ data.dt);
    $('#iconToday').attr("src", iconUrl);
    $('#todayTemp').text("Temp: " + data.main.temp);
    $('#todayWind').text("Wind: " + data.wind.speed);
    $('#todayHumid').text("Humidity: " + data.main.humidity);
    });

    //variable to hold the api call string
    var callStringWeather5 = ("https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&units=imperial&&appid="+apiKey);
//FIXME: load next 5 days cards DATE, ICON, HIGH, //LOW, WIND HUMIDITY
//got name off of text for button less computing than pulling from storage
    fetch(callStringWeather5)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("this is the weather data");
    console.log(data);
    //load future weather
    var cardD;
    var cardI;
    var cardT;
    var cardW;
    var cardH;
    var iconUrl
   // for (var i = 0; i < data.length; i++) {

    for (var i = 0; i < 5; i++) {
        cardD = "#" + i + "cardTitle";
        cardI = "#" + i + "cardIcon";
        cardT = "#" + i + "Temp";
        cardW = "#" + i + "Wind";
        cardH = "#" + i + "Humidity";
        $(cardD).text(data.list[i].dt);
        iconUrl = "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon +".png";
        $(cardI).attr("src", iconUrl);
        $(cardT).text("Temp: " + data.list[i].wind.speed);
        $(cardW).text("Wind: " + data.list[i].wind.speed);
        $(cardH).text("Humidity: " + data.list[i].main.humidity);
     }
    });
}


init();


//search button CLICK listener
searchBtnEl.on("click", function(){
    var textboxEl = $('#input');
    var cityName = textboxEl.val().trim();
    validateCity(cityName);
    textboxEl.val('');
});


//city button CLICK listener
cityBtnEl.on("click", function(){
    //cityName already validated before put on button so don't need to validate again.
    var cityName = this.innerHTML;
    //validate city will get the lat and lon and then load the weather in that function
    console.log(cityName +"buttonPressed");
    validateCity(cityName);
});