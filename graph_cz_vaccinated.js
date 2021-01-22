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
var vaccinated_chart_cz = document.getElementById("vaccinated_cz").getContext('2d');

// Create datasets for vaccinations
vaccinated_dataset = [];
vaccinated_dataset.push( {
    label: 'Vaccinated',
    data: current_values['cz_vaccinated'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8[1],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8[1],
    tension: 0.2,
    fill: false
} );

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(26, 11, 100),
        datasets: vaccinated_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed vaccinations against COVID-19 in Czech republic", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
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
