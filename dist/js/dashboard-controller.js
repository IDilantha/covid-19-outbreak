$(function () {
    confirmedGlobalCases();
    localCases();
});
 

function confirmedGlobalCases() {    
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {    
        if (http.readyState == 4 && http.status == 200) {
            var conf = JSON.parse(http.responseText);
            var active = conf.confirmed.value - (conf.recovered.value + conf.deaths.value);
            $("#globalTotCases").text(conf.confirmed.value);
            $("#globalTotActive").text(active);        
            $("#globalTotRecovered").text(conf.recovered.value);
            $("#globalTotDeaths").text(conf.deaths.value);
        }
    };
   
   http.open('GET','https://covid19.mathdro.id/api',true);
   
   http.send();
}

function localCases() {    
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
            
            $("#localTotConfirmed").text(totCasesSL);            
            $("#localTotHospitalized").text(totHospitalSL);
            $("#localTotActive").text(totActiveSL);
            $("#localTotRecovered").text(totRecoverSL);
            $("#localTotDeaths").text(totDeathSL);
            //$(".update").text(updatedDateSL+ " (Sri Lanka Time)");

            $("#todayLocalNewCases").text(newSL);
            $("#DailyRecLbl").text();
            $("#todayLocalDeaths").text(newDeathSL);        
       }
   };

   http.open('GET','https://hpb.health.gov.lk/api/get-current-statistical',true);    
   http.send();
}