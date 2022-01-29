// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackInfected(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    // Confirmed cases
    if (index < 2) {
        var meta = ci.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    } else { // predictions
        for (i=2; i<=JITTER_COUNT+1; i++) {
            var meta = ci.getDatasetMeta(i);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[i].hidden : null;
        }
    }

    // Update the chart
    ci.update();
}

// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackGrowthRate(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    // Observed, Average and rolling average growth rate
    if (index < 3) {
        meta = ci.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    } else { // predictions
        for (i=0; i<=JITTER_COUNT; i++) {
            var meta = ci.getDatasetMeta(i+3);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[i+3].hidden : null;
        }
    }

    // Update the chart
    ci.update();
}

// the infected graph
var infected_chart_cz_13_02 = document.getElementById("infected_cz_13-02").getContext('2d');

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
    label: 'Predicted 13.02 (modified 28.02.2021)',
    data: model['cz_13-02']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[7],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[7],
    tension: 0,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    label = 'Predicted 13.02 (jitter)';
    cz_13_02 = {
        label: label,
        data: model['cz_13-02']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[7], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8[7],
        tension: 0.2,
        fill: false
    };
    infected_dataset.push( cz_13_02 );
}

// The infected chart
window.infected_chart = new Chart(infected_chart_cz_13_02, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, GLOBAL_CHART_DAYS),
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
                    max: 400000,
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
                    if (legendItem.datasetIndex < 3) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }
                },
            },
        },
        annotation: {
            drawTime: 'beforeDatasetsDraw',
            events: ['click'],
            annotations: [
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Mar 14, 2020',
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "First lockdown",
                        enabled: true
                    },
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Oct 22, 2020',
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "Second lockdown",
                        enabled: true
                    },
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Dec 27, 2020',
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "3rd lockdown",
                        enabled: true
                    },
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Feb 15, 2021',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "green",
                        content: "End emergency state",
                        enabled: true,
                        yAdjust: -30,
                    },
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Mar 1, 2021',
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "4th lockdown",
                        enabled: true
                    },
                },
            ]
        },
    }
});
