// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackInfected(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    // Confirmed cases
    if (index == 0) {
        var meta = ci.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    } else { // predictions
        for (i=1; i<=JITTER_COUNT+1; i++) {
            var meta = ci.getDatasetMeta(i);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[i].hidden : null;
        }
    }

    // Update the chart
    ci.update();
}

// the infected graph
var infected_chart_sk = document.getElementById("infected_sk").getContext('2d');

// Create datasets for infected projections
infected_dataset = [];
infected_dataset.push( {
    label: 'Confirmed',
    data: current_values['sk'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[1],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[1],
    tension: 0,
    fill: false
} );

// The infected chart
window.infected_chart = new Chart(infected_chart_sk, {
    type: 'line',
    data: {
        labels: gen_days(6, 2, 480),
        datasets: infected_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed total cases of COVID-19 in Slovakia", "Slovaks stopped publishing data about recovered cases so this has no sense."]
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
                    max: 350000,
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
                    if (legendItem.datasetIndex < 2) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }
                },
            },
        },
    }
});