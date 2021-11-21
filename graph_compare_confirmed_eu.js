// days since March 1st, 2020
var CHART_DAYS = 720;

// the compare graph
var compare_100_confirmed = document.getElementById("canvas_compare_100_confirmed").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Austria',
    data: current_values['at_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Belgium',
    data: current_values['br_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Croatia',
    data: current_values['cr_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'France',
    data: current_values['fr_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Germany',
    data: current_values['de_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Greece',
    data: current_values['gr_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Hungary',
    data: current_values['hu_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );

dataset.push( {
    label: 'Italy',
    data: current_values['it_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Netherlands',
    data: current_values['nl_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Poland',
    data: current_values['pl_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Portugal',
    data: current_values['pt_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Romania',
    data: current_values['ro_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Slovakia',
    data: current_values['sk_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Slovenia',
    data: current_values['sl_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Serbia',
    data: current_values['sr_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Spain',
    data: current_values['es_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Ukraine',
    data: current_values['ua_100_confirmed'],
    spanGaps: true,
    borderWidth: 1,
    pointStyle: 'cross',
    borderColor: '#' + pal_18[dataset.length],
    pointBorderColor:  '#' + pal_18[dataset.length],
    tension: 0,
    fill: false
} );

// The infected chart
window.compare= new Chart(compare_100_confirmed, {
    type: 'line',
    data: {
        labels: gen_days_relative(CHART_DAYS),
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            fontColor: 'rgba(200,200,200,1)',
            fontSize: fontsize,
            text: ["Confirmed (sum total) COVID-19 cases per 100k inhabitants", "Relative by day of 100 cases reached", "(click on the legend to show/hide data)"]
        },
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(30,30,30,1)',
                    lineWidth: 1
                },
                //type: 'time',
                //time: {
                //    unit: 'day'
                //}
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
