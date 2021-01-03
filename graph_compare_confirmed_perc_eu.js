// the compare graph
var compare_100_confirmed_perc = document.getElementById("canvas_compare_100_confirmed_perc").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Austria',
    data: current_values['at_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Belgium',
    data: current_values['br_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Croatia',
    data: current_values['cr_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'France',
    data: current_values['fr_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Germany',
    data: current_values['de_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Greece',
    data: current_values['gr_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Hungary',
    data: current_values['hu_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );

dataset.push( {
    label: 'Italy',
    data: current_values['it_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Netherlands',
    data: current_values['nl_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Poland',
    data: current_values['pl_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Portugal',
    data: current_values['pt_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Romania',
    data: current_values['ro_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Slovakia',
    data: current_values['sk_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Slovenia',
    data: current_values['sl_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Serbia',
    data: current_values['sr_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Spain',
    data: current_values['es_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Ukraine',
    data: current_values['ua_100_confirmed_perc'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + pal_18[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );

// The infected chart
window.compare= new Chart(compare_100_confirmed_perc, {
    type: 'line',
    data: {
        labels: gen_days_relative(390),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontSize: fontsize,
            text: ["Confirmed COVID-19 cases as a percentage of the population", "Relative by day of 100 cases reached", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 10,
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