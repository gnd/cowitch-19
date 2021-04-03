// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackInfected(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    // Confirmed cases
    if (index < 1) {
        meta = ci.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    } else { // predictions
        for (i=0; i<=JITTER_COUNT; i++) {
            var meta = ci.getDatasetMeta(index+i*3);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index+i*2].hidden : null;
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
            var meta = ci.getDatasetMeta(index+i*3);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index+i*2].hidden : null;
        }
    }

    // Update the chart
    ci.update();
}

// the infected graph
var model_chart_sk = document.getElementById("model_sk").getContext('2d');

// Create datasets for infected projections
dataset = [];
dataset.push( {
    label: 'Confirmed',
    data: current_values['sk'].slice(39),   // Staring from 1st of March, data is from 22nd January
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Predicted (7-Day Average)',
    data: model['sk_avg7_normal']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[5],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[5],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Predicted - Pesimistic',
    data: model['sk_avg7_pesimist']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted (7-Day Average)' + '-' + i;
    } else {
        label = 'Predicted (7-Day Average)';
    }
    sk_avg7 = {
        label: label,
        data: model['sk_avg7_normal']['total'][i],
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
    if (i>0) {
        label = 'Predicted - Pesimistic' + '-' + i;
    } else {
        label = 'Predicted - Pesimistic';
    }
    sk_avg7_pesimist = {
        label: label,
        data: model['sk_avg7_pesimist']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[0], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8[0],
        tension: 0.2,
        fill: false
    };
    dataset.push( sk_avg7 );
    dataset.push( sk_avg7_pesimist );
}

// The infected chart
window.infected_chart_sk = new Chart(model_chart_sk, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, model_days_sk),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Scenario: (17.04.2020):", "Confirmed and predicted cases of COVID-19 in Slovakia", "Rate of growth continues to descend similarly as in Czechia,", "or it starts to climb slowly as in Japan, the similarities are eerie.", "(click on the legend to show/hide data)"]
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
                    suggestedMax: 1000,
                }
            }]
        },
        //legendCallback: legendCallbackInfected,
        legend: {
            display: true,
            onClick: legendCallbackInfected,
            labels: {
                fontSize: fontsize,
                // Show only first three labels
                filter: function (legendItem, chartData) {
                    if (legendItem.datasetIndex < 3) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }
                },
            },
        },
    }
});

// the growth rate
var growth_rate_chart_sk = document.getElementById("growth_rate_sk").getContext('2d');

// Create datasets for growth_rate
dataset = [];
dataset.push( {
    label: 'Observed',
    data: data['sk']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Observed (Average)',
    data: data['sk']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[3],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[3],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Observed (7-Day Average)',
    data: data['sk']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[4],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[4],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Predicted (7-Day Average)',
    data: model['sk_avg7_normal']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[5],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[5],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Predicted - Pesimistic',
    data: model['sk_avg7_pesimist']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0.2,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted (7-Day Average)' + '-' + i;
    } else {
        label = 'Predicted (7-Day Average)';
    }
    sk_avg7 =  {
        label: label,
        data: model['sk_avg7_normal']['growth_rate'][i],
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
    if (i>0) {
        label = 'Predicted - Pesimistic' + '-' + i;
    } else {
        label = 'Predicted - Pesimistic';
    }
    sk_avg7_pesimist =  {
        label: label,
        data: model['sk_avg7_pesimist']['growth_rate'][i],
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
    dataset.push( sk_avg7 );
    dataset.push( sk_avg7_pesimist );
}

// The growth rate chart
window.growth_rate_chart_sk = new Chart(growth_rate_chart_sk, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 180),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Scenario: (17.04.2020):", "Confirmed and predicted rate of growth of COVID-19 in Slovakia", "Rate of growth continues to descend similarly as in Czechia,", "or it starts to climb slowly as in Japan, the similarities are eerie.", "(click on the legend to show/hide data)"]
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
                    min: 1,
                    suggestedMax: 2.5,
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
    }
});
