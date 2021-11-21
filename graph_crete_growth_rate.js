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
var crete_growth_rate = document.getElementById("graph_crete_growth_rate").getContext('2d');

// Create datasets for infected projections
crete_dataset = [];
crete_dataset.push( {
    label: 'Growth rate',
    data: current_values['gr_crete_growth_rate'],
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
    label: 'Growth rate (average)',
    data: current_values['gr_crete_growth_rate_avg'],
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
    label: 'Growth rate (7-day average)',
    data: current_values['gr_crete_growth_rate_avg7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[4],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[4],
    tension: 0,
    fill: false
} );

// The infected chart
window.infected_chart = new Chart(crete_growth_rate, {
    type: 'line',
    data: {
        labels: gen_days(0, 0, 420, 2021),
        datasets: crete_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Growth rate of COVID-19 in Crete"]
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
                    suggestedMin: 0.8,
                    max: 1.6,
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