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
    borderWidth: 1,
    borderColor: '#ff0000',
    pointStyle: 'crossRot',
    pointBorderColor:  '#ff0000',
    tension: 0.2,
    fill: false
} );
vaccinated_dataset.push( {
    label: '2nd dose',
    data: current_values['cz_vaccinated_b_total'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#00ff00',
    pointStyle: 'rect',
    pointBorderColor:  '#00ff00',
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
                    color: 'rgba(30,30,30,1)',
                    lineWidth: 1
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
        annotation: {
            drawTime: 'beforeDatasetsDraw',
            events: ['click'],
            annotations: [
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Feb 06, 2021',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "AstraZeneca in CZ (19k)",
                        enabled: true
                    },
                },
            ]
        },
    }
});
