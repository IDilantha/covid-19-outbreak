var newSL;
const Dates = [];
const DailyCases = [];
$(function () {
    confirmedGlobalCases();
    localCases();
    DailyCasesFunc();
    loadDailyLocalChart();  
    loadGlobalTable(); 
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

    http.open('GET', 'https://covid19.mathdro.id/api', true);

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
            newSL = conf.data.local_new_cases;
            var newDeathSL = conf.data.local_new_deaths;
            var totActiveSL = conf.data.local_active_cases;
            var todayNewGlobal = conf.data.global_new_cases;

            $("#localTotConfirmed").text(totCasesSL);
            $("#localTotHospitalized").text(totHospitalSL);
            $("#localTotActive").text(totActiveSL);
            $("#localTotRecovered").text(totRecoverSL);
            $("#localTotDeaths").text(totDeathSL);
            $("#todayNewGlobalCases").text(todayNewGlobal);
            //$(".update").text(updatedDateSL+ " (Sri Lanka Time)");

            $("#todayLocalNewCases").text(newSL);
            $("#DailyRecLbl").text();
            $("#todayLocalDeaths").text(newDeathSL);
        }
    };

    http.open('GET', 'https://hpb.health.gov.lk/api/get-current-statistical', true);
    http.send();
}

function DailyCasesFunc() {

    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            const conf = JSON.parse(http.responseText);

            for (let i = 0; i < conf.length; i++) {
                Dates[i] = conf[i].Date.split('T')[0];;
                DailyCases[i] = conf[i].Cases;
            }
            DailyCases[conf.length - 1] = DailyCases[conf.length - 2] + newSL;
            return conf;
        }
    };

    http.open('GET', 'https://api.covid19api.com/country/sri-lanka/status/confirmed/live', true);

    http.send();
}

function loadDailyLocalChart() {

    var options = {
        chart: {
            renderTo: 'container',            
            type: 'spline',
            height : 500 
        },
        series: [{ name: 'Total Cases', data: [] }],
        title: {
            text: 'Total Cases Chart in Sri Lanka'
        },
        yAxis: {
            title: {
                text: 'Total Number of Cases'
            }                 
        },
        xAxis: {
            title: {
                text: 'Date'
            },
            range: 40        
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                    }
                }
            }]
        }
    };
    var url = "https://api.covid19api.com/country/sri-lanka/status/confirmed/live";
    $.getJSON(url, function (data) {
        options.series[0].data = DailyCases;
        options.xAxis.categories = Dates;
        var chart = new Highcharts.Chart(options);
    });
}


//Global table
function  loadGlobalTable(){
    axios.get('https://api.thevirustracker.com/free-api?countryTotals=ALL').then(function (response) {
        var rawData = arrData(response.data.countryitems[0]);
        myTable(rawData);
    }).catch(function (error) {
        console.log(error);
    })
    
    function arrData(objData) {
        var arrayData = Object.keys(objData).map(function(key) {
            return objData[key]
        });
        return myData(arrayData);
    }
    
    function myData(data) {
        var list = [];
        data.forEach(function(item) {
            list.push([
                '<img src="flags/'+item.code+'.svg" width="40"> &nbsp '+
                item.title,
                item.total_cases,
                '+'+item.total_new_cases_today,
                '+'+item.total_new_deaths_today,
                item.total_deaths,
                item.total_recovered,
                item.total_active_cases
            ]);
        });       
        return list.slice(0, 182);
    }
  
    function myTable(dataSet) {
        var myDataTable = $('#datatable').DataTable({
            data: dataSet,
            columns: [
                { title: "Countries and territories" },
                { title: "Total Cases" },
                { title: "New Cases" },
                { title: "New Deaths" },
                { title: "Total Deaths" },
                { title: "Recoveries" },
                { title: "Active" }
            ],
            order: [[ 1, "desc" ]]
        });
        return myDataTable;
    }
}
