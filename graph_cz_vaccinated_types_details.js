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
var vaccinated_chart_cz_types_det = document.getElementById("vaccinated_cz_types_det").getContext('2d');

// Create datasets for vaccinations
vaccinated_dataset = [];
for (var i=0; i<used_vaccines.length; i++) {
    vaccine = used_vaccines[i];
    
    vaccinated_dataset.push( {
        label: vaccine + ' (1st)',
        data: current_values['cz_vaccinated_a_' + vaccine],
        spanGaps: true,
        borderWidth: 0.6,
        borderColor: '#' + pal_vacc_a[i],
        pointStyle: 'line',
        radius: 2,
        rotation: 90,
        pointBorderColor:  '#' + pal_vacc_a[i],
        tension: 0.2,
        fill: false
    } );
    vaccinated_dataset.push( {
        label: vaccine + ' (2nd)',
        data: current_values['cz_vaccinated_b_' + vaccine],
        spanGaps: true,
        borderWidth: 1,
        borderColor: '#' + pal_vacc_b[i],
        pointStyle: 'line',
        radius: 2,
        rotation: 90,
        pointBorderColor:  '#' + pal_vacc_b[i],
        tension: 0.2,
        fill: false
    } );
}

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_cz_types_det, {
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
            text: ["Confirmed vaccinations against COVID-19 in Czech Republic (breakdown by vaccine types)", "(click on the legend to show/hide data)"]
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
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 'Mar 30, 2021',
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        backgroundColor: "red",
                        content: "AstraZeneca renamed to Vaxzevria",
                        enabled: true
                    },
                },
            ]
        },
    }
});
