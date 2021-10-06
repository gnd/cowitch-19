var FIXED_DATASETS = 3;         // Observed, Observed Average, Observed Avg 7
var TOTAL_PREDICTIONS = 5;      // Increase when adding a new prediction

// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackGrowthRate(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    
    meta = ci.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    
    // Turn off also jitter for predictions
    if (index => FIXED_DATASETS) {
        var OFFSET = index + TOTAL_PREDICTIONS + (index - TOTAL_PREDICTIONS + (FIXED_DATASETS-1)) * (JITTER_COUNT-1);
        for (i=0; i<JITTER_COUNT; i++) {
            var meta = ci.getDatasetMeta(i + OFFSET);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[i + OFFSET].hidden : null;
        }
    }

    // Update the chart
    ci.update();
}


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
    borderWidth: 1,
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
    borderWidth: 1,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0.2,
    fill: false
});
// Predicted 27.12.2020
growth_rate_dataset.push( {
    label: 'Predicted 27.12',
    data: model['cz_27-12']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[6],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[6],
    tension: 0.2,
    fill: false
});
// Predicted 05.01.2020
growth_rate_dataset.push( {
    label: 'Predicted 05.01',
    data: model['cz_05-01']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_8[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[2],
    tension: 0.2,
    fill: false
});
// Predicted 05.01.2020
growth_rate_dataset.push( {
    label: 'Predicted 13.02',
    data: model['cz_13-02']['growth_rate']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[7],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[7],
    tension: 0.2,
    fill: false
});

// Jitters for 20.09 and 31.10 and 27.12 and 13.02
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
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted 27.12' + '-' + i;
    } else {
        label = 'Predicted 27.12';
    }
    cz_27_12 =  {
        label: label,
        data: model['cz_27-12']['growth_rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[6], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor: '#' + pal_8[6],
        tension: 0.2,
        fill: false
    };
    growth_rate_dataset.push( cz_27_12 );
}
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted 05.01' + '-' + i;
    } else {
        label = 'Predicted 05.01';
    }
    cz_05_01 =  {
        label: label,
        data: model['cz_05-01']['growth_rate'][i],
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
    growth_rate_dataset.push( cz_05_01 );
}
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Predicted 13.02' + '-' + i;
    } else {
        label = 'Predicted 13.02 (modified 28.02.2021)';
    }
    cz_13_02 =  {
        label: label,
        data: model['cz_13-02']['growth_rate'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[7], 0.2),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor: '#' + pal_8[7],
        tension: 0.2,
        fill: false
    };
    growth_rate_dataset.push( cz_13_02 );
}

// The growth rate chart
window.growth_rate_chart = new Chart(growth_rate_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 670),
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
                // Show only first N labels
                filter: function (legendItem, chartData) {
                    if (legendItem.datasetIndex < FIXED_DATASETS + TOTAL_PREDICTIONS) {
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
                        content: "Third lockdown",
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
                        yAdjust: -30
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
