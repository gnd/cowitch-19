// the compare graph
var compare = document.getElementById("canvas_compare").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Singapore',
    data: current_values['sg_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Japan',
    data: current_values['jp_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea',
    data: current_values['kr_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Italy',
    data: current_values['it_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Slovakia',
    data: current_values['sk_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Greece',
    data: current_values['gr_1'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );

// The infected chart
window.compare= new Chart(compare, {
    type: 'line',
    data: {
        labels: gen_days_relative(120),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed cases of COVID-19 in Singapore, Japan, Korea, Slovakia, Czechia, Italy, Greece", "Relative by first day of occurence", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 2500,
                }
            }]
        },
        legend: {
            display: true,
            labels : {
                fontSize: fontsize,
            },
        },
    }
});
// hide Italy;
window.compare.data.datasets[4].hidden = true;
window.compare.update();

// the compare_100 graph
var compare_100 = document.getElementById("canvas_compare_100").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Singapore',
    data: current_values['sg_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Japan',
    data: current_values['jp_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea',
    data: current_values['kr_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Italy',
    data: current_values['it_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Slovakia',
    data: current_values['sk_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Greece',
    data: current_values['gr_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_8_sol[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_8_sol[dataset.length],
    tension: 0,
    fill: false
} );

// The compare_100 chart
window.compare_100= new Chart(compare_100, {
    type: 'line',
    data: {
        labels: gen_days_relative(120),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed cases of COVID-19 in Singapore, Japan, Korea, Slovakia, Czechia, Italy, Greece", "Relative by day of first 100 cases", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 2500,
                }
            }]
        },
        legend: {
            display: true,
            labels: {
                fontSize: fontsize,
            },
        },
    }
});
// hide Italy;
window.compare_100.data.datasets[4].hidden = true;
window.compare_100.update();

// Compare rowth rates
var compare_100 = document.getElementById("canvas_compare_growth_rates").getContext('2d');
dataset = [];
dataset.push( {
    label: 'CZ',
    data: data['cz_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[0],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'CZ Avg',
    data: data['cz_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'CZ Avg 7',
    data: data['cz_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'JP',
    data: data['jp_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'JP Avg',
    data: data['jp_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'JP Avg 7',
    data: data['jp_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'SG',
    data: data['sg_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'SG Avg',
    data: data['sg_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'SG Avg 7',
    data: data['sg_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'KR',
    data: data['kr_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'KR Avg',
    data: data['kr_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'KR Avg 7',
    data: data['kr_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'IT',
    data: data['it_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'IT Avg',
    data: data['it_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'IT Avg 7',
    data: data['it_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'SK',
    data: data['sk_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'SK Avg',
    data: data['sk_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'SK Avg 7',
    data: data['sk_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'GR',
    data: data['gr_100']['growth_rate'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'GR Avg',
    data: data['gr_100']['growth_rate_avg'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );
dataset.push( {
    label: 'GR Avg 7',
    data: data['gr_100']['growth_rate_avg_7'],
    spanGaps: true,
    borderWidth: 2,
    borderColor: '#' + pal_21[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_21[dataset.length],
    tension: 0.2,
    fill: false
} );

// The compare_growth_rates chart
window.compare_growth_rates= new Chart(compare_100, {
    type: 'line',
    data: {
        labels: gen_days_relative(60),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Growth rates of COVID-19 in Japan, Czechia, Korea, Singapore, Italy, SLovakia", "Relative by day of first 100 cases", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
            }],
            yAxes: [{
                ticks: {
                    //min: 0.9,
                    //suggestedMax: 2.2,
                }
            }]
        },
        legend: {
            display: true,
            labels: {
                fontSize: fontsize,
            },
        },
    }
});
