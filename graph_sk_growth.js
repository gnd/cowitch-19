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


// the growth rate
var growth_rate_chart_sk = document.getElementById("growth_rate_sk").getContext('2d');

// Create datasets for growth_rate
growth_rate_dataset = [];
growth_rate_dataset.push( {
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
growth_rate_dataset.push( {
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
growth_rate_dataset.push( {
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

// The growth rate chart
window.growth_rate_chart = new Chart(growth_rate_chart_sk, {
    type: 'line',
    data: {
        labels: gen_days(6, 2, 480),
        datasets: growth_rate_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed and average growth rate of COVID-19 in Slovakia", "(click on the legend to show/hide data)"]
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
                    if (legendItem.datasetIndex < 6) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    }

                },
            },
        },
    }
});
