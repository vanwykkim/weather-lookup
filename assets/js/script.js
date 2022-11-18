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
let dateG;


//initialize the page
function init(){
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
    dateG = moment.unix(data.dt);
    $('#cityName').text(data.name+ " "+ dateG.format("MM/DD/YYYY"));
    $('#iconToday').attr("src", iconUrl);
    $('#todayTemp').text("Temp: " + data.main.temp +" F");
    $('#todayWind').text("Wind: " + data.wind.speed+" mph");
    $('#todayHumid').text("Humidity: " + data.main.humidity+"%");
    });

    //variable to hold the api call string
    var callStringWeather5 = ("https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&units=imperial&&appid="+apiKey);

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
    var iconUrl;
    var thisDate;
    var cardCount = 0;
    var i = 0;

    while(cardCount< 5 || i < data.list.length) {
        thisDate = moment.unix(data.list[i].dt);
        if(dateG.format("DD")!==thisDate.format("DD")){
        dateG = thisDate;
        cardD = "#" + cardCount + "cardTitle";
        cardI = "#" + cardCount + "cardIcon";
        cardT = "#" + cardCount + "Temp";
        cardW = "#" + cardCount + "Wind";
        cardH = "#" + cardCount + "Humidity";
        $(cardD).text(thisDate.format("MM/DD/YYYY"));
        iconUrl = "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon +".png";
        $(cardI).attr("src", iconUrl);
        $(cardT).text("Temp: " + data.list[i].main.temp+" F");
        $(cardW).text("Wind: " + data.list[i].wind.speed+" mph");
        $(cardH).text("Humidity: " + data.list[i].main.humidity+"%");
        cardCount++;
        }
        i++
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