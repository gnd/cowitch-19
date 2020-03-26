// the compare graph
var compare = document.getElementById("korea_test").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Korea',
    data: current_values['kr'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea recovered',
    data: current_values['kr-rec'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push ( {
    label: 'Korea recovered - prediction',
    data:  model['model_kr']['healed_cum'][0],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea dead',
    data: current_values['kr-dead'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea dead - prediction',
    data: model['model_kr']['deaths_cum'][0],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'CZ dead',
    data: current_values['cz-dead'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'CZ dead - prediction',
    data: model['projection']['deaths_cum'][0],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[dataset.length],
    tension: 0,
    fill: false
} );


// The infected chart
window.korea_test= new Chart(korea_test, {
    type: 'line',
    data: {
        labels: labels_relative,
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
                    suggestedMax: 100,
                }
            }]
        },
        legend: {
            display: true,
        },
    }
});


// the korea_pred graph
var korea_pred = document.getElementById("korea_pred").getContext('2d');
dataset = [];
dataset.push( {
    label: 'KR Confirmed',
    data: current_values['kr'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'KR Predicted',
    data:  model['model_kr2']['total']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'KR Healthy - Predicted',
    data:  model['model_kr2']['healed_cum']['avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_8[2],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[2],
    tension: 0,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'KR Predicted' + '-' + i;
    } else {
        label = 'KR Predicted';
    }
    projection = {
        label: label,
        data: model['model_kr2']['total'][i],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: hexToRGBA('#' + pal_8[1], 0.4),
        pointStyle: 'circle',
        radius: 0,
        pointBorderColor:  '#' + pal_8[1],
        tension: 0.2,
        fill: false
    };
    dataset.push( projection );
}
// The infected chart
window.korea_pred = new Chart(korea_pred, {
    type: 'line',
    data: {
        labels: labels_relative,
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
                    if (legendItem.datasetIndex < 2) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }

                },
            }
        },
    }
});
