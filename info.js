$(function () {    
    loadCountries();
    confirmedGlobalCases();
    //confirmedCases();
    load();
    test();
});

function load() {    
     var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var lastUpdate = JSON.parse(http.responseText).lastUpdate;
           // $(".update").text(lastUpdate);
        }
    };

    http.open('GET','https://covid19.mathdro.id/api',true);    
    http.send();
}

function loadCountries() {    
    var http = new XMLHttpRequest();

   http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var countries = JSON.parse(http.responseText).countries;            

            for (let i = 0; i < countries.length; i++) {                
                var countriesList = '<option>' + countries[i].name +" " + "("+countries[i].iso2+")" + '</option>';
                $("#countries-list").append(countriesList);              
            }
        }
   };

   http.open('GET','https://covid19.mathdro.id/api/countries',true);     
  
   http.send();
}

function confirmedGlobalCases() {    
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {    
        if (http.readyState == 4 && http.status == 200) {
            var conf = JSON.parse(http.responseText);
            var active = conf.confirmed.value - (conf.recovered.value + conf.deaths.value);
            $("#gtotCaseLbl").text(conf.confirmed.value);
            $("#gtotActiveLbl").text(active);        
            $("#gtotRecLbl").text(conf.recovered.value);
            $("#gtotDeathLbl").text(conf.deaths.value);
        }
    };
   
   http.open('GET','https://covid19.mathdro.id/api',true);
   
   http.send();
}

function confirmedCases(country) {    
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {    
        if (http.readyState == 4 && http.status == 200) {
            var conf = JSON.parse(http.responseText);
            
            $("#totCaseLbl").text(conf[0].confirmed);
            $("#totActiveLbl").text(conf[0].active);        
            $("#totRecLbl").text(conf[0].recovered);
            $("#totDeathLbl").text(conf[0].deaths);
           // $("#cou").text(country);
        }
    };

    http.open('GET','https://covid19.mathdro.id/api/countries/LK/confirmed',true);
    
    http.send();
}


function countryLoad() {
    var itemCode = document.getElementById("txtCode").options[document.getElementById("txtCode").selectedIndex].text;
    for (var i = 0; i < itemsList.length; i++) {
        if (itemCode == itemsList[i].code) {
            document.getElementById("txtDescription").value = itemsList[i].description;
            document.getElementById("txtQtyOnHand").value = itemsList[i].qtyOnHand;
            document.getElementById("txtUnitPrice").value = itemsList[i].unitPrice;
        }
    }
}


function test() {    
    var http = new XMLHttpRequest();

   http.onreadystatechange = function () {
       if (http.readyState == 4 && http.status == 200) {           
            var conf = JSON.parse(http.responseText);

            var updatedDateSL = conf.data.update_date_time;
            var newSL = conf.data.local_new_cases;
            var totCasesSL = conf.data.local_total_cases;
            var totHospitalSL = conf.data.local_total_number_of_individuals_in_hospitals;
            var totRecoverSL = conf.data.local_recovered;
            var totDeathSL = conf.data.local_deaths;
            var newDeathSL = conf.data.local_new_deaths;
            var totActiveSL = conf.data.local_active_cases;
            
            $("#totCaseLbl").text(totCasesSL);
            $("#totActiveLbl").text(totActiveSL);
            $("#totRecLbl").text(totRecoverSL);
            $("#totDeathLbl").text(totDeathSL);
            $(".update").text(updatedDateSL+ " (Sri Lanka Time)");
       }
   };

   http.open('GET','https://hpb.health.gov.lk/api/get-current-statistical',true);    
   http.send();
}