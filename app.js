$(document).ready(function () {
    navigator.geolocation.getCurrentPosition(findWeather);

    $("#refresh").on("click", function() {
        console.log("clicked");
        $("#content").html($("#card1"));
        navigator.geolocation.getCurrentPosition(findWeather);
    });
});

function findWeather(pos) {
    var url = "https://forecast.weather.gov/MapClick.php?lat=" + pos["coords"]["latitude"] + "&lon=" + pos["coords"]["longitude"] + "&FcstType=json";
    console.log(url);

    var jqxhr = $.get(url);

    // Set the callback for if/when the AJAX request successfully returns
    jqxhr.done(function(data){
        // data will be the string response to the AJAX request
        displayWeather(data);
        console.log(data);
    });

    // Set the callback for if/when the AJAX request fails
    jqxhr.fail(function(jqXHR){
        // jqXHR is the failed call (so we can access status, e.g.)
        $("#results").text("Could not load data");
        console.log("Error: " + jqXHR.status);
    });

    // Set a callback to execute regardless of success or failure result
    jqxhr.always(function(){
        console.log("Done with AJAX request");
    });
}

function displayWeather(data){
    // Set title
    $("#title").text("Weather in " + data["location"]["areaDescription"]);
    $("#desc").text(data["data"]["text"][0]);
    $("#vis").text("Visibility: " + data["currentobservation"]["Visibility"]);
    $("#card0Title").text(data["time"]["startPeriodName"][0]);

    for(var i=0; i<14; i++){
        if(i>1){
            $("#card" + (i-1)).clone().attr('id', 'card' + (parseInt(/card(\d+)/.exec($("#card"+(i-1)).attr('id'))[1], 10)+1)).appendTo("#content");
            $("#card"+i).attr('id', 'card' + (parseInt(/card(\d+)/.exec($("#card"+(i-1)).attr('id'))[1], 10)+1));
            $("#card" + i + " h5").text(data["time"]["startPeriodName"][i]);
        }
        $("#card" + i + " img").attr("src", data["data"]["iconLink"][i]);
        $("#card" + i + " h1").text(data["data"]["temperature"][i] + " °F");
    }
}
