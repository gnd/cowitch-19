// the growth rate
var cz_future_long = document.getElementById("canvas_cz_future_long").getContext('2d');

// Create datasets for growth_rate
dataset = [];
dataset.push( {
    label: 'Growth rate - Observed',
    data: data['cz']['growth_rate'],
    yAxisID: 'growth_rate',
    spanGaps: true,
    borderWidth: 2,
    radius: 0,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Growth rate - Observed average',
    data: data['cz']['growth_rate_avg'],
    yAxisID: 'growth_rate',
    spanGaps: true,
    borderWidth: 1,
    radius: 0,
    borderColor: '#' + pal_8[3],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[3],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Growth rate - Observed 7 day average',
    data: data['cz']['growth_rate_avg_7'],
    yAxisID: 'growth_rate',
    spanGaps: true,
    borderWidth: 1,
    radius: 0,
    borderColor: '#' + pal_8[4],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[4],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Growth rate - Projected',
    data: model['cz_future_2']['growth_rate']['avg'],
    yAxisID: 'growth_rate',
    spanGaps: true,
    borderWidth: 1,
    radius: 0,
    borderColor: '#' + pal_8[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[0],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'All Infected - Projected',
    data: model['cz_future_2']['total']['avg'],
    yAxisID: 'population',
    spanGaps: true,
    borderWidth: 2,
    radius: 0,
    borderColor: '#' + pal_10[5],
    pointStyle: 'circle',
    borderDash: [5, 5],
    pointBorderColor:  '#' + pal_10[5],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Reported Infected - Projected',
    data: model['cz_future_2']['total_reported']['avg'],
    yAxisID: 'population',
    spanGaps: true,
    borderWidth: 3,
    radius: 0,
    borderColor: '#' + pal_10[5],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[5],
    tension: 0.2,
    fill: false
} );
/*
dataset.push( {
    label: 'Infected - Cumulative',
    data: model['cz_future_2']['infected_cumulative'][0],
    yAxisID: 'population',
    spanGaps: true,
    borderWidth: 1,
    radius: 0,
    borderColor: '#' + pal_10[6],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[6],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'Recovered - Cumulative',
    data: model['cz_future_2']['recovered'][0],
    yAxisID: 'population',
    spanGaps: true,
    borderWidth: 1,
    radius: 0,
    borderColor: '#' + pal_10[7],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[7],
    tension: 0.2,
    fill: false
} );*/
dataset.push( {
    label: 'Dead - Projected',
    data: model['cz_future_2']['deaths']['avg'],
    yAxisID: 'population',
    spanGaps: true,
    borderWidth: 3,
    radius: 0,
    borderColor: '#' + pal_10[8],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_10[8],
    tension: 0.2,
    fill: false
} );
for (i=0; i<JITTER_COUNT; i++) {
    if (i>0) {
        label = 'Projected' + '-' + i;
    } else {
        label = 'Projected';
    }
    temp = {
        label: label,
        data: model['cz_future_2']['growth_rate'][i],
        yAxisID: 'growth_rate',
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
    dataset.push( temp );;
}

// The growth rate chart
window.cz_future_long = new Chart(cz_future_long, {
    type: 'line',
    data: {
        labels: gen_days(0, 2, 500),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Scenario (first use of SIER, still in progress):", "After virtually stopping during the summer, COVID-19 returns to Czechia in autumn 2020", "All population numbers are inflated by a factor of 2 to account for 'hidden infected'", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [
                {
                    id: 'growth_rate',
                    position: 'left',
                    ticks: {
                        min: 0,
                        max: 2.5,
                    }
                },{
                    id: 'population',
                    position: 'right',
                    ticks: {
                        min: 0,
                        Max: 5200000,
                    }
                },
            ]
        },
        legend: {
            display: true,
            onClick: legendCallback,
            labels: {
                fontSize: fontsize,
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
                    enabled: true,
                    position: "top",
                },
            }, {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 'May 11, 2020',
                borderColor: 'green',
                borderWidth: 2,
                label: {
                    backgroundColor: "green",
                    content: "Quarantine end",
                    enabled: true,
                    position: "top",
                },
            }, {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 'Nov 12, 2020',
                borderColor: 'green',
                borderWidth: 2,
                label: {
                    backgroundColor: "red",
                    content: "Quarantine start II",
                    enabled: true,
                    position: "top",
                },
            }]
        },
    }
});
