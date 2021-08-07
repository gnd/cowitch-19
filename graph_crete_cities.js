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
    label: 'Chania',
    data: current_values['gr_chania_confirmed'],
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
    data: current_values['gr_lasithi_confirmed'],
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
    data: current_values['gr_heraklion_confirmed'],
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
    data: current_values['gr_rethymno_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[4],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[4],
    tension: 0,
    fill: false
} );

// The infected chart
window.infected_chart = new Chart(crete_cities, {
    type: 'line',
    data: {
        labels: gen_days(0, 0, 240, 2021),
        datasets: crete_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Daily new cases of COVID-19 in Crete", "Breakdown by Cretan regional units"]
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
                    min: 0,
                    max: 300,
                }
            }]
        },
        //legendCallback: legendCallbackInfected,
        legend: {
            display: true,
            onClick: legendCallbackInfected,
            labels: {
                fontSize: fontsize,
                // Show only first two labels
                filter: function (legendItem, chartData) {
                    if (legendItem.datasetIndex < 4) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }
                },
            },
        },
    }
});