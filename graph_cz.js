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
var infected_chart_cz = document.getElementById("infected_cz").getContext('2d');

// Create datasets for infected projections
infected_dataset = [];
infected_dataset.push( {
    label: 'Confirmed',
    data: current_values['cz'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0,
    fill: false
} );
infected_dataset.push( {
    label: 'Predicted',
    data:  model['cz_a']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0,
    fill: false
} );
infected_dataset.push( {
    label: 'Optimistic',
    data: model['cz_b']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[2],
    tension: 0,
    fill: false
} );
infected_dataset.push( {
    label: '7 Day Average',
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
    if (i>0) {
        label = 'Predicted' + '-' + i;
    } else {
        label = 'Predicted';
    }
    cz_a = {
        label: label,
        data: model['cz_a']['total'][i],
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
    if (i>0) {
        label = 'Old' + '-' + i;
    } else {
        label = 'Old';
    }
    cz_b = {
        label: label,
        data: model['cz_b']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[2], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8[2],
        tension: 0.2,
        fill: false
    };
    if (i>0) {
        label = '7 Day Average' + '-' + i;
    } else {
        label = '7 Day Average';
    }
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
    infected_dataset.push( cz_a );
    infected_dataset.push( cz_b );
    infected_dataset.push( cz_c );
}

// The infected chart
window.infected_chart = new Chart(infected_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 123),
        datasets: infected_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
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
                    max: 10000,
                }
            }]
        },
        //legendCallback: legendCallbackInfected,
        legend: {
            display: true,
            onClick: legendCallbackInfected,
            labels: {
                // Show only first three labels
                filter: function (legendItem, chartData) {
                    if (legendItem.datasetIndex < 4) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }

                },
            }
        },
        annotation: {
            drawTime: 'afterDatasetsDraw',
            events: ['click'],
            annotations: [{
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 'Mar 14, 2020',
                borderColor: 'green',
                borderWidth: 2,
                label: {
                    backgroundColor: "red",
                    content: "Quarantine start",
                    enabled: true
                },
            }]
        },
    }
});

// the growth rate
var growth_rate_chart_cz = document.getElementById("growth_rate_cz").getContext('2d');

// Create datasets for growth_rate
growth_rate_dataset = [];
growth_rate_dataset[0] = {
    label: 'Observed',
    data: data['cz']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[1] = {
    label: 'Observed average',
    data: data['cz']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[3],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[3],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[2] = {
    label: 'Observed 7 day average',
    data: data['cz']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[4],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[4],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[3] = {
    label: 'Predicted',
    data: model['cz_a']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[4] = {
    label: 'Predicted - optimistic',
    data: model['cz_b']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[2],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[5] = {
    label: 'Predicted - avg7',
    data: model['cz_c']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[5],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[5],
    tension: 0.2,
    fill: false
};
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted' + '-' + i;
    } else {
        label = 'Predicted';
    }
    cz_a = {
        label: label,
        data: model['cz_a']['growth_rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[0], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8[0],
        tension: 0.2,
        fill: false
    };
    if (i>0) {
        label = 'Predicted - optimistic' + '-' + i;
    } else {
        label = 'Predicted - optimistic';
    }
    cz_b =  {
        label: label,
        data: model['cz_b']['growth_rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[2], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor: '#' + pal_8[2],
        tension: 0.2,
        fill: false
    };
    if (i>0) {
        label = 'Predicted - avg7' + '-' + i;
    } else {
        label = 'Predicted - avg7';
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
    growth_rate_dataset.push( cz_a );
    growth_rate_dataset.push( cz_b );
    growth_rate_dataset.push( cz_c );
}

// The growth rate chart
window.growth_rate_chart = new Chart(growth_rate_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 80),
        datasets: growth_rate_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
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
                    min: 1,
                    max: 2.5,
                }
            }]
        },
        legend: {
            display: true,
            onClick: legendCallbackGrowthRate,
            labels: {
                // Show only first three labels
                filter: function (legendItem, chartData) {
                    if (legendItem.datasetIndex < 6) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }

                },
            }
        },
        annotation: {
            drawTime: 'afterDatasetsDraw',
            events: ['click'],
            annotations: [{
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 'Mar 14, 2020',
                borderColor: 'green',
                borderWidth: 2,
                label: {
                    backgroundColor: "red",
                    content: "Quarantine start",
                    enabled: true
                },
            }]
        },
    }
});
