// the infected graph
var cz_future = document.getElementById("cz_future").getContext('2d');

// Create datasets for infected projections
dataset = [];
dataset.push( {
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
dataset.push( {
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
dataset.push( {
    label: 'Predicted - Quarantine lift',
    data:  model['cz_future_1']['total']['avg'],
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
        label = 'Predicted - Quarantine lift' + '-' + i;
    } else {
        label = 'Predicted - Quarantine lift';
    }
    cz_future_1 = {
        label: label,
        data: model['cz_future_1']['total'][i],
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
    dataset.push( cz_a );
    dataset.push( cz_future_1 );
}

// The infected chart
window.cz_future_chart = new Chart(cz_future, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 123),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Scenario (29.03.2020)", "Czech government decides to lift quarantine after Easter Monday 13.4.", "People start celebrating already on Friday 10.4 after the peak of the epidemy was announced, exhausted from the quarantine.", "During the following week infection rates slowly grow."]
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
        legend: {
            display: true,
            onClick: legendCallback,
            labels: {
                fontSize: fontsize,
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
                    value: 'Mar 14, 2020',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "Quarantine start",
                        enabled: true
                    },
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Apr 13, 2020',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "green",
                        content: "Quarantine end",
                        enabled: true
                    },
                },
        ]
        },
    }
});
