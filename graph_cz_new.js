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

// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackGrowthRate(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    // Observed, Average and rolling average growth rate
    if (index < 4) {
        meta = ci.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    } else { // predictions
        for (i=0; i<=JITTER_COUNT; i++) {
            var meta = ci.getDatasetMeta(i+5);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[i+5].hidden : null;
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
        labels: gen_days(0, 2, 300),
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

// the growth rate
var growth_rate_chart_cz = document.getElementById("growth_rate_cz").getContext('2d');

// Create datasets for growth_rate
growth_rate_dataset = [];
growth_rate_dataset.push( {
    label: 'Observed',
    data: data['cz']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0.2,
    fill: false
} );
growth_rate_dataset.push( {
    label: 'Observed (Average)',
    data: data['cz']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[3],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[3],
    tension: 0.2,
    fill: false
} );
growth_rate_dataset.push( {
    label: 'Observed (7-Day Average)',
    data: data['cz']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[4],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[4],
    tension: 0.2,
    fill: false
} );

// Predicted 20.09.2020
growth_rate_dataset.push( {
    label: 'Predicted 20.09',
    data: model['cz_c']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[5],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[5],
    tension: 0.2,
    fill: false
});
// Predicted 31.10.2020
growth_rate_dataset.push( {
    label: 'Predicted 31.10',
    data: model['cz_31-10']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0.2,
    fill: false
});

// Jitters for 20.09 and 31.10
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted 20.09' + '-' + i;
    } else {
        label = 'Predicted 20.09';
    }
    cz_c =  {
        label: label,
        data: model['cz_c']['growth_rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[5], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor: '#' + pal_8[5],
        tension: 0.2,
        fill: false
    };
    growth_rate_dataset.push( cz_c );
}
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted 31.10' + '-' + i;
    } else {
        label = 'Predicted 31.10';
    }
    cz_31_10 =  {
        label: label,
        data: model['cz_31-10']['growth_rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[0], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor: '#' + pal_8[0],
        tension: 0.2,
        fill: false
    };
    growth_rate_dataset.push( cz_31_10 );
}


// The growth rate chart
window.growth_rate_chart = new Chart(growth_rate_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 300),
        datasets: growth_rate_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed, average and predicted growth rate of COVID-19 in Czech republic", "(click on the legend to show/hide data)"]
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
                    min: 0.8,
                    max: 1.6,
                }
            }]
        },
        legend: {
            display: true,
            onClick: legendCallbackGrowthRate,
            labels: {
                fontSize: fontsize,
                // Show only first three labels
                filter: function (legendItem, chartData) {
                    if (legendItem.datasetIndex < 5) {
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
                        content: "First lockdown",
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
