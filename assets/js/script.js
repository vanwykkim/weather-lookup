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
//key for API
const apiKey = "7b5031efd51fb04c52651f1ab0b416b0";


//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7b5031efd51fb04c52651f1ab0b416b0
// [5 Day Weather Forecast](https://openweathermap.org/forecast5)


//initialize the page
function init(){
    //FIXME:if saved cities load them buttons on left - but weather should load blank
   // loadCityBtns();
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
    console.log(cityLat+ " lat in load");
    console.log(cityLon +" lon in load");
    
    //variable to hold the api call string
    var callStringWeather = ("https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&units=imperial&cnt=6&appid="+apiKey);
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
        console.log("this is the weather data");
    console.log(data);
    //data[0]
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
    loadCityBtns();
    textboxEl.val('');
});


//city button CLICK listener
cityBtnEl.on("click", function(){
    //cityName already validated before put on button so don't need to validate again.
    var cityName = this.name;
    //validate city will get the lat and lon and then load the weather in that function
    validateCity(cityName);
});