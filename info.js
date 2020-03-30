$(document).ready(function () {    
    confirmedGlobalCases();
    confirmedCases();
    load();
});

function load() {    
     var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        var lastUpdate = JSON.parse(http.responseText).lastUpdate;
        $(".update").text(lastUpdate);
    };

    http.open('GET','https://covid19.mathdro.id/api');    
    http.send();
}

function confirmedGlobalCases() {    
    var http = new XMLHttpRequest();

   http.onreadystatechange = function () {    
       var conf = JSON.parse(http.responseText);
       
       $("#gtotCaseLbl").text(conf[0].confirmed);
       $("#gtotActiveLbl").text(conf[0].active);        
       $("#gtotRecLbl").text(conf[0].recovered);
       $("#gtotDeathLbl").text(conf[0].deaths);
   };

   http.open('GET','https://covid19.mathdro.id/api/confirmed');
   
   http.send();
}

function confirmedCases() {    
     var http = new XMLHttpRequest();

    http.onreadystatechange = function () {    
        var conf = JSON.parse(http.responseText);
        
        $("#totCaseLbl").text(conf[0].confirmed);
        $("#totActiveLbl").text(conf[0].active);        
        $("#totRecLbl").text(conf[0].recovered);
        $("#totDeathLbl").text(conf[0].deaths);
    };

    http.open('GET','https://covid19.mathdro.id/api/countries/LK/confirmed');
    
    http.send();
}