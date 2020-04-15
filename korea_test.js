// the compare graph
var compare = document.getElementById("canvas_korea_test").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Korea',
    data: current_values['kr'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia recovered',
    data: current_values['cz_recovered'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia recovered - prediction',
    data: model['cz_a']['recovered'][0],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea recovered',
    data: current_values['kr_recovered'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push ( {
    label: 'Korea recovered - prediction',
    data:  model['model_kr2']['recovered'][0],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea dead',
    data: current_values['kr_deaths'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea dead - prediction',
    data: model['model_kr2']['deaths'][0],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'CZ dead',
    data: current_values['cz_deaths'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'CZ deaths - prediction',
    data: model['cz_a']['deaths'][0],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_10[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[dataset.length],
    tension: 0,
    fill: false
} );


// The infected chart
window.korea_test= new Chart(compare, {
    type: 'line',
    data: {
        labels: gen_days_relative(120),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            text: ["Testing prediction & reality in Czechia and S.Korea", "Relative by first day of occurence", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 500,
                }
            }]
        },
        legend: {
            display: true,
        },
    }
});


// the korea_pred graph
var korea_pred = document.getElementById("canvas_korea_pred").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Korea - confirmed',
    data: current_values['kr'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[0],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea (predicted from Day 38)',
    data:  model['model_kr2']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8_sol[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[1],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea (predicted from day 59)',
    data:  model['model_kr2a']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8_sol[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[2],
    tension: 0,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Korea (predicted from Day 38)' + '-' + i;
    } else {
        label = 'Korea (predicted from Day 38)';
    }
    projection = {
        label: label,
        data: model['model_kr2']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8_sol[1], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8_sol[1],
        tension: 0.2,
        fill: false
    };
    dataset.push( projection );
    if (i>0) {
        label = 'Korea (predicted from day 59)' + '-' + i;
    } else {
        label = 'Korea (predicted from day 59)';
    }
    projection = {
        label: label,
        data: model['model_kr2a']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8_sol[2], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8_sol[2],
        tension: 0.2,
        fill: false
    };
    dataset.push( projection );
}
// The infected chart
window.korea_pred = new Chart(korea_pred, {
    type: 'line',
    data: {
        labels: gen_days(21, 0, 150),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            text: ["Testing if able to predict the Korean development", "(click on the legend to show/hide data)"]
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
                    suggestedMax: 10000,
                }
            }]
        },
        legend: {
            display: true,
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
            annotations: [
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: moment(new Date(2020, 0, 22+38)),
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "Day 38",
                        enabled: true
                    }
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: moment(new Date(2020, 0, 22+59)),
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "Day 59",
                        enabled: true
                    }
                },
            ]
        },
    }
});
