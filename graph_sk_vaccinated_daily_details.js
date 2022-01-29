// the growth rate
var vaccinated_chart_sk_det_daily = document.getElementById("vaccinated_sk_det_daily").getContext('2d');

// Create datasets for vaccinations
vaccinated_dataset = [];
vaccinated_dataset.push( {
    label: '1st dose',
    data: current_values['sk_vaccinated_a_daily_total'],
    spanGaps: true,
    borderWidth: 1,
    borderColor: '#' + pal_vacc_a[0],
    pointStyle: 'crossRot',
    pointBorderColor:  '#' + pal_vacc_a[0],
    tension: 0.2,
    fill: false
} );
vaccinated_dataset.push( {
    label: '2nd dose',
    data: current_values['sk_vaccinated_b_daily_total'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_vacc_b[1],
    pointStyle: 'rect',
    pointBorderColor:  '#' + pal_vacc_b[1],
    tension: 0.2,
    fill: false
} );

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_sk_det_daily, {
    type: 'line',
    data: {
        labels: gen_days(4, 0, GLOBAL_CHART_DAYS-311),
        datasets: vaccinated_dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontColor: 'rgba(200,200,200,1)',
            fontSize: fontsize,
            text: ["Confirmed vaccinations against COVID-19 in Slovakia (daily numbers)", "(click on the legend to show/hide data)"]
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
            labels: {
                fontSize: fontsize,
                fontColor: 'rgba(150,150,150,1)',
            },
        },
    }
});
