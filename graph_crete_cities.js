// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackInfected(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    var meta = ci.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    
    // Update the chart
    ci.update();
}

// the infected graph
var crete_cities = document.getElementById("graph_crete_cities").getContext('2d');

// Create datasets for infected projections
crete_dataset = [];
crete_dataset.push( {
    label: 'Crete (Total)',
    data: current_values['gr_crete_confirmed_daily'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#000000',
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor: '#000000',
    tension: 0,
    fill: false
} );
crete_dataset.push( {
    label: 'Crete (7-day rolling average)',
    data: current_values['gr_crete_confirmed_daily_avg7'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[0],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor: '#' + pal_8[0],
    tension: 0,
    fill: false
} );
crete_dataset.push( {
    label: 'Chania',
    data: current_values['gr_chania_confirmed_daily'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[1],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[1],
    tension: 0,
    fill: false
} );
crete_dataset.push( {
    label: 'Lasithi',
    data: current_values['gr_lasithi_confirmed_daily'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[2],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[2],
    tension: 0,
    fill: false
} );
crete_dataset.push( {
    label: 'Heraklion',
    data: current_values['gr_heraklion_confirmed_daily'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[3],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[3],
    tension: 0,
    fill: false
} );
crete_dataset.push( {
    label: 'Rethymno',
    data: current_values['gr_rethymno_confirmed_daily'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[4],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[4],
    tension: 0,
    fill: false
} );
crete_dataset.push( {
    label: 'Crete - Estimated current sick',
    data: current_values['gr_crete_infected_estimate'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[5],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor: '#' + pal_8[5],
    tension: 0,
    fill: false,
    hidden: true
} );

// The infected chart
window.infected_chart = new Chart(crete_cities, {
    type: 'line',
    data: {
        labels: gen_days(0, 0, GLOBAL_CHART_DAYS-306, 2021),
        datasets: crete_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Daily new cases of COVID-19 in Crete (BROKEN)", "Breakdown by Cretan regional units"]
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 250,
                }
            }]
        },
        //legendCallback: legendCallbackInfected,
        legend: {
            display: true,
            onClick: legendCallbackInfected,
            labels: {
                fontSize: fontsize
            },
        },
    }
});

/*
window.infected_chart.data.datasets.forEach((dataSet, i) => {
  var meta = chart.getDatasetMeta(i);

  meta.hidden = (i>5);
});

this.chart.update();

*/