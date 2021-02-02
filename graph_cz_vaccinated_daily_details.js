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
var vaccinated_chart_cz_det_daily = document.getElementById("vaccinated_cz_det_daily").getContext('2d');

// Create datasets for vaccinations
vaccinated_dataset = [];
for (var i=0; i<age_slots.length; i++) {
    age = age_slots[i];
    age_desc = age_slots_desc[i];
    
    vaccinated_dataset.push( {
        label: age_desc + ' (1st)',
        data: current_values['cz_vaccinated_a_daily_' + age],
        spanGaps: true,
        borderWidth: 1,
        borderColor: '#' + pal_vacc_a[i],
        pointStyle: 'crossRot',
        pointBorderColor:  '#' + pal_vacc_a[i],
        tension: 0.2,
        fill: false
    } );
    vaccinated_dataset.push( {
        label: age_desc + ' (2nd)',
        data: current_values['cz_vaccinated_b_daily_' + age],
        spanGaps: true,
        borderWidth: 2,
        borderColor: '#' + pal_vacc_b[i],
        pointStyle: 'rect',
        pointBorderColor:  '#' + pal_vacc_b[i],
        tension: 0.2,
        fill: false
    } );
}

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_cz_det_daily, {
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
            text: ["Confirmed vaccinations against COVID-19 in Czech Republic (breakdown by age groups, daily numbers)", "(click on the legend to show/hide data)"]
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
    }
});
