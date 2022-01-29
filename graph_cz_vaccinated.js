// legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallbackGrowthRate(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;

    meta = ci.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

    // Update the chart
    ci.update();
}

// the growth rate
var vaccinated_chart_cz = document.getElementById("vaccinated_cz").getContext('2d');

// Create datasets for vaccinations
vaccinated_dataset = [];
vaccinated_dataset.push( {
    label: '1st dose',
    data: current_values['cz_vaccinated_a_total'],
    spanGaps: true,
    borderWidth: 0.5,
    borderColor: '#f2b705',
    pointStyle: 'line',
    radius: 2,
    rotation: 90,
    pointBorderColor:  '#f2b705',
    tension: 0.2,
    fill: false
} );
vaccinated_dataset.push( {
    label: '2nd dose',
    data: current_values['cz_vaccinated_b_total'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#d96704',
    pointStyle: 'line',
    radius: 2,
    rotation: 90,
    pointBorderColor: '#d96704',
    tension: 0.2,
    fill: false
} );

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_cz, {
    type: 'line',
    data: {
        labels: gen_days(26, 11, GLOBAL_CHART_DAYS-302),
        datasets: vaccinated_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontColor: 'rgba(200,200,200,1)',
            fontSize: fontsize,
            text: ["Confirmed vaccinations against COVID-19 in Czech Republic", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(30,30,30,1)',
                    lineWidth: 1
                },
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(70,70,70,1)',
                    lineWidth: 1,
                },
                ticks: {
                    stepSize: 500000
                }
            }],
        },
        legend: {
            display: true,
            onClick: legendCallbackGrowthRate,
            labels: {
                fontSize: fontsize,
                fontColor: 'rgba(150,150,150,1)',
            },
        },
    }
});
