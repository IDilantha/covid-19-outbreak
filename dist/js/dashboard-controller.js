var newSL;


$(function () {
    confirmedGlobalCases();
    //DailyCasesFunc();
    localCases();    
    
});

window.addEventListener('load', DailyCasesChart);

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
            var totCasesSL = conf.data.local_total_cases;
            var totHospitalSL = conf.data.local_total_number_of_individuals_in_hospitals;
            var totRecoverSL = conf.data.local_recovered;
            var totDeathSL = conf.data.local_deaths;
            newSL= conf.data.local_new_cases;
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

//Daily Cases Line Chart 
async function DailyCasesChart() {  
    const ctx = document.getElementById('chart').getContext('2d');
    const datas = await DailyCasesFunc();
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: datas.Dates,
            datasets: [{
                label: 'Total Cases',
                fill : false,                   
                backgroundColor: 'rgb(239, 43, 242)',
                borderColor: 'rgb(0, 123, 200)',
                data: datas.DailyCases                
            }]
        },

        // Configuration options go here
        // options: {
        //     animation: {
        //         duration:20
        //     },            
        //     maintainAspectRatio: true,
        //     responsive: true,   
        //     layout: {
        //         padding: {
        //             top: 20
        //         }
        //     },
        //     legend: {
        //         display: true,
        //         position: 'top'
        //     }        
        // }
    });
    // var option = {
    //     animation: {
    //         duration:5000
    //     },
    //      responsive:false,
    //     maintainAspectRatio: false
    // };
    
    // var myBarChart = Chart.Bar(ctx, {
    //   data: data,
    //     options:option,
    
    // });
}

//Get daily data to draw the chart1
// var ctx = document.getElementById('chart').getContext("2d");
// var data = {
//     labels:  Dates,
//     datasets: [
//         {
//             label: "Total Cases",
//             backgroundColor: [
//                 'rgb(239, 43, 242)'
//             ],
//             fill: false,
//             borderColor: [
//                 'rgb(0, 123, 200)'
//             ],
//             borderWidth: 1,
//             data:  DailyCases,
//         }
//     ]
// };
// var option = {
//     animation: {
//         duration:2000
//     },
//     responsive:true,
//     maintainAspectRatio: false
// };

// var myBarChart = Chart.Line(ctx, {
//     data: data,
//     options:option
// });


async function DailyCasesFunc() {    
    const Dates = [];
    const DailyCases = [];

    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {    
        if (http.readyState == 4 && http.status == 200) {
            const conf = JSON.parse(http.responseText);
            
            for (let i = 0; i < conf.length; i++) {
                Dates[i] = conf[i].Date.split('T')[0];;
                DailyCases[i] = conf[i].Cases;            
            } 
            DailyCases[conf.length-1] = DailyCases[conf.length-2] + newSL;
        }
    };
   
   http.open('GET','https://api.covid19api.com/country/sri-lanka/status/confirmed/live',true);
   
   http.send();

   return {Dates, DailyCases};
}
