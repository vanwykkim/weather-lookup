// an array to hold the top 10 cities checked for localStorage
var theCityArray = new Array();
//link to element city button in the Dom using id
var cityBtnEl = $('#cityBtn');
//link to element search button in the Dom using id
var searchBtnEl = $('#searchBtn');
// link to city button elements section in Dom
var cityBtnSectionEl = $('#buttonSection');
//global variable to hold lat
var cityLat;
//global variable to hold lon
var cityLon;


//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7b5031efd51fb04c52651f1ab0b416b0
// [5 Day Weather Forecast](https://openweathermap.org/forecast5)


//initialize the page
function init(){
    //FIXME:if saved cities load them buttons on left - but weather should load blank
    loadCityBtns();
}

function validateCity(cityName){
    //call string for city to get lat and lon
    //FIXME: get rid of cityName=Seattle;
    var callStringCity = ("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=7b5031efd51fb04c52651f1ab0b416b0");
    fetch(callStringCity)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data);
    // for (var i = 0; i < data.length; i++) {
    //     ;
    // }
    });
    //FIXME:check if city name is valid returned object? if not text box, exit function and alert bad city name show bad name in alert

    //if valid city add it to cityArray in storage
    theCityArray = JSON.parse(localStorage.getItem("myCityArray"));
    //TODO: check if city is in the array already. If so remove from current spot and put in front
    if(theCityArray == null || theCityArray == 'undefined'){
        //if no items yet can't have lenght?
        theCityArray = [cityName];
    }else if(theCityArray.length < 10){
        //just need to add
        theCityArray.unshift(cityName);
    }else{
        //remove from end and add to front so load in order on buttons with newest on top
        theCityArray.pop();
        theCityArray.unshift(cityName);
    }
      //set updated array in storage
      localStorage.setItem("myCityArray", JSON.stringify(theCityArray));
}

function loadCityBtns(){
    //try and get cities from storage
    theCityArray = JSON.parse(localStorage.getItem("myCityArray"));
     //check if array existed already if so can load cities 
     //make sure on start up or new browser there are stored cities to work with
    if(theCityArray !== null && theCityArray !== 'undefined'){
        for(var i = 0; i<theCityArray.length;i++){
            //create/append a city button 
        var cityButtonEl = $('<button>');
        //set a id to know which element you're grabbing to save in listener function
        cityButtonEl.attr('id', i);
        cityButtonEl.attr('class', 'btn');
        cityButtonEl.addClass('cityBtn');
        cityButtonEl.attr('value',theCityArray[i]);
        cityButtonEl.attr('type','button');
        cityBtnSectionEl.append(cityButtonEl);
        }
        //FIXME: do you need to make buttons everytime refresh page or do they persist over
    //TODO:if buttons made only change text otherwise make buttons if button id does not exist for index yet make it. 
    //TODO:up to 10 buttons make a button with id of saved city array index to look up city from storage and set text when change
    //TODO:after 10 buttons just change text
    }
}

function loadWeather(){
    
    //variable to hold the api call string
    var callStringWeather = ("//https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat+"&lon="+cityLon+"&appid=7b5031efd51fb04c52651f1ab0b416b0");
 //FIXME:get weather object    
//TODO:load weather section and 5 days cards for city called
//FIXME: load today section DATE, ICON, CURRENT TEMP? //HIGH, //LOW, WIND, HUMIDITY
//FIXME: load next 5 days cards DATE, ICON, HIGH, //LOW, WIND HUMIDITY
//got name off of text for button less computing than pulling from storage
    fetch(callStringWeather)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data);
    // for (var i = 0; i < data.length; i++) {
    //     ;
    // }
    });
}


init();


//search button CLICK listener
searchBtnEl.on("click", function(){
    var textboxEl = $('#input');
    var cityName = textboxEl.val().trim();
    validateCity(cityName);
    loadWeather();
    loadCityBtns();
});


//city button CLICK listener
cityBtnEl.on("click", function(){
    //cityName already validated before put on button so don't need to validate again.
    var cityName = this.name;
    //FIXME:get lat and lon or have it saved in array with cities
    validateCity(cityName);
    //load the weather info for the city into the weather section and 5 day cards
    loadWeather();
});