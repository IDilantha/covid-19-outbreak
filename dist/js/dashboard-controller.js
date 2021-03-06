var newSL;
var totRecoverSL;
const Dates = [];
const DailyCases = [];
const DailyRecovered = [];
const DailyDeaths = [];
var yesterdayRecovered;

$(function () {
    DailyRecoveredFunc();
    confirmedGlobalCases();
    DailyCasesFunc();    
    localCases();    
    loadDailyLocalChart();
    loadGlobalTable();
});

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

function DailyRecoveredFunc() {

    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            const conf = JSON.parse(http.responseText);

            for (let i = 0; i < conf.length; i++) {
                Dates[i] = conf[i].Date.split('T')[0];;
                DailyRecovered[i] = conf[i].Recovered;
                DailyDeaths[i] = conf[i].Deaths;
                yesterdayRecovered = totRecoverSL-DailyRecovered[conf.length-1];
            }             
            $("#DailyRecLbl").text(yesterdayRecovered);           
            return conf;
        }
    };

    http.open('GET', 'https://api.covid19api.com/country/sri-lanka', true);

    http.send();
}

function confirmedGlobalCases() {
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var conf = JSON.parse(http.responseText).Global;
            $("#globalTotCases").text(conf.TotalConfirmed.toLocaleString());
            $("#globalTotActive").text((conf.TotalConfirmed - (conf.TotalRecovered+conf.TotalDeaths)).toLocaleString());
            $("#todayNewGlobalCases").text(conf.NewConfirmed.toLocaleString());
            $("#globalTotRecovered").text(conf.TotalRecovered.toLocaleString());
            $("#globalTotDeaths").text(conf.TotalDeaths.toLocaleString());
            $("#globalTodayNewDeaths").text(conf.NewDeaths.toLocaleString());
            $("#globalClosedCases").text((conf.TotalRecovered+conf.TotalDeaths).toLocaleString());
        }
    };

    http.open('GET', 'https://api.covid19api.com/summary', true);

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
            totRecoverSL = conf.data.local_recovered;
            var totDeathSL = conf.data.local_deaths;
            newSL = conf.data.local_new_cases;
            var newDeathSL = conf.data.local_new_deaths;
            var totActiveSL = conf.data.local_active_cases;

            $("#localTotConfirmed").text(totCasesSL.toLocaleString());
            $("#localTotHospitalized").text(totHospitalSL.toLocaleString());
            $("#localTotActive").text(totActiveSL.toLocaleString());
            $("#localTotRecovered").text(totRecoverSL.toLocaleString());
            $("#localTotDeaths").text(totDeathSL.toLocaleString());
            //$(".update").text(updatedDateSL+ " (Sri Lanka Time)");
           
            $("#todayLocalNewCases").text(newSL.toLocaleString());            
            $("#todayLocalDeaths").text(newDeathSL.toLocaleString());
        }
    };

    http.open('GET', 'https://hpb.health.gov.lk/api/get-current-statistical', true);
    http.send();
}

function loadDailyLocalChart() {

    var options = {
        chart: {
            renderTo: 'container',
            type: 'spline',
            height: 500
        },
        series: [{ name: 'Total Cases', data: [] }, { name: 'Total Recovered', data: [], color: 'green' },
        { name: 'Total Deaths', data: [], color: 'red' }],
        title: {
            text: 'Total Cases Chart in Sri Lanka'
        },
        yAxis: {
            title: {
                text: 'Total Number'
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
    var url2 = "https://api.covid19api.com/country/sri-lanka"
    $.getJSON(url, function (data) {
        options.series[0].data = DailyCases;
        options.xAxis.categories = Dates;
        var chart = new Highcharts.Chart(options);
    });
    $.getJSON(url2, function (data) {
        options.series[1].data = DailyRecovered;
        options.xAxis.categories = Dates;
        var chart = new Highcharts.Chart(options);
    });
    $.getJSON(url2, function (data) {
        options.series[2].data = DailyDeaths;
        options.xAxis.categories = Dates;
        var chart = new Highcharts.Chart(options);
    });

}

//Global table
function loadGlobalTable() {
    axios.get('https://api.covid19api.com/summary').then(function (response) {             
        var rawData = arrData(response.data.Countries);
        myTable(rawData);
    }).catch(function (error) {
        console.log(error);
    })

    function arrData(objData) {
        var arrayData = Object.keys(objData).map(function (key) {
            return objData[key]
        });
        return myData(arrayData);
    }

    function myData(data) {
        var list = [];
        data.forEach(function (item) {
            list.push([
                '<img src="flags/' + item.CountryCode + '.svg" width="40"> &nbsp ' +
                item.Country,
                item.TotalConfirmed.toLocaleString(),
                '+' + item.NewConfirmed.toLocaleString(),
                '+' + item.NewDeaths.toLocaleString(),
                item.TotalDeaths.toLocaleString(),                
                '+' + item.NewRecovered.toLocaleString(),
                item.TotalRecovered.toLocaleString()
            ]);
        });
        return list.slice(0, 200);
    }

    function myTable(dataSet) {
        var myDataTable = $('#datatable').DataTable({
            data: dataSet,
            columns: [
                { title: "Countries and Territories" },
                { title: "Total Cases" },
                { title: "New Cases" },
                { title: "New Deaths" },
                { title: "Total Deaths" },
                { title: "New Recovered" },
                { title: "Total Recovered" }
                
            ],
            order: [[1, "desc"]]
        });
        return myDataTable;
    }
}
