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
var infected_chart_cz = document.getElementById("infected_cz").getContext('2d');

// Create datasets for infected projections
infected_dataset = [];
infected_dataset.push( {
    label: 'Confirmed',
    data: current_values['cz'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[1],
    pointStyle: 'cross',
    radius: 5,
    pointBorderColor:  '#' + pal_8[1],
    tension: 0,
    fill: false
} );
infected_dataset.push( {
    label: 'Predicted (7-Day Average)',
    data: model['cz_c']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[5],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[5],
    tension: 0,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    label = 'Predicted (7-Day Average)-'+i;
    cz_c = {
        label: label,
        data: model['cz_c']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[5], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8[5],
        tension: 0.2,
        fill: false
    };
    infected_dataset.push( cz_c );
}

// The infected chart
window.infected_chart = new Chart(infected_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 480),
        datasets: infected_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed and predicted cases of COVID-19 in Czech republic", "(click on the legend to show/hide data)"]
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
                    max: 200000,
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
        annotation: {
            drawTime: 'afterDatasetsDraw',
            events: ['click'],
            annotations: [
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Mar 14, 2020',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: 'First lockdown',
                        enabled: true
                    },
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Oct 1, 2020',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "Second lockdown: 1.10.2020",
                        enabled: true
                    },
                },
            ]
        },
    }
});