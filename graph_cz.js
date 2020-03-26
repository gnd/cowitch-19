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
            var meta = ci.getDatasetMeta(index+i*2);
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
            var meta = ci.getDatasetMeta(index+i*2);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index+i*2].hidden : null;
        }
    }

    // Update the chart
    ci.update();
}

// the infected graph
var infected_chart_cz = document.getElementById("infected_cz").getContext('2d');
chart_max = Math.max(get_max(model['projection']['total']), get_max(model['projection-optimistic']['total']));

// Create datasets for infected projections
infected_dataset = [];
infected_dataset[0] = {
    label: 'Confirmed',
    data: current_values['cz'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[1],
    tension: 0,
    fill: false
};
infected_dataset[1] = {
    label: 'Predicted',
    data:  model['projection']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + infected_pal[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[0],
    tension: 0,
    fill: false
};
infected_dataset[2] = {
    label: 'Optimistic',
    data: model['projection-optimistic']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + infected_pal[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[2],
    tension: 0,
    fill: false
};
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted' + '-' + i;
    } else {
        label = 'Predicted';
    }
    projection = {
        label: label,
        data: model['projection']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + infected_pal[0], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + infected_pal[0],
        tension: 0.2,
        fill: false
    };
    if (i>0) {
        label = 'Optimistic' + '-' + i;
    } else {
        label = 'Optimistic';
    }
    projection_optimistic = {
        label: label,
        data: model['projection-optimistic']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + infected_pal[2], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + infected_pal[2],
        tension: 0.2,
        fill: false
    };
    infected_dataset.push( projection );
    infected_dataset.push( projection_optimistic );
}

// The infected chart
window.infected_chart = new Chart(infected_chart_cz, {
    type: 'line',
    data: {
        labels: labels,
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
                    suggestedMax: 3500,
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
                    if (legendItem.datasetIndex < 3) {
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
chart_max = Math.max(get_max(model['projection']['total']), get_max(model['projection-optimistic']['total']));

// Create datasets for growth_rate
growth_rate_dataset = [];
growth_rate_dataset[0] = {
    label: 'Observed',
    data: data['cz']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[1],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[1] = {
    label: 'Observed average',
    data: data['cz']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + infected_pal[3],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[3],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[2] = {
    label: 'Observed 7 day average',
    data: data['cz']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + infected_pal[4],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[4],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[3] = {
    label: 'Predicted',
    data: model['projection']['rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + infected_pal[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[0],
    tension: 0.2,
    fill: false
};
growth_rate_dataset[4] = {
    label: 'Optimistic',
    data: model['projection-optimistic']['rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + infected_pal[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[2],
    tension: 0.2,
    fill: false
};
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted' + '-' + i;
    } else {
        label = 'Predicted';
    }
    projection = {
        label: label,
        data: model['projection']['rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + infected_pal[0], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + infected_pal[0],
        tension: 0.2,
        fill: false
    };
    if (i>0) {
        label = 'Optimistic' + '-' + i;
    } else {
        label = 'Optimistic';
    }
    projection_optimistic =  {
        label: label,
        data: model['projection-optimistic']['rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + infected_pal[2], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor: '#' + infected_pal[2],
        tension: 0.2,
        fill: false
    };
    growth_rate_dataset.push( projection );
    growth_rate_dataset.push( projection_optimistic );
}

// The growth rate chart
window.growth_rate_chart = new Chart(growth_rate_chart_cz, {
    type: 'line',
    data: {
        labels: labels.slice(0,40),
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
                    min: 0,
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
                    if (legendItem.datasetIndex < 5) {
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
