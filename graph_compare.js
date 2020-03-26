// the compare graph
var compare = document.getElementById("compare").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Singapore',
    data: current_values['sg'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Japan',
    data: current_values['jp'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea',
    data: current_values['kr'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Italy',
    data: current_values['it'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );

// The infected chart
window.compare= new Chart(compare, {
    type: 'line',
    data: {
        labels: labels_relative,
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            text: ["Confirmed cases of COVID-19 in Japan, Czechia, Korea, relative by first day of occurence", "(click on the legend to show/hide data)"]
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
        },
    }
});
// hide Italy;
window.compare.data.datasets[4].hidden = true;
window.compare.update();

// the compare_100 graph
var compare_100 = document.getElementById("compare_100").getContext('2d');
dataset = [];
dataset.push( {
    label: 'Singapore',
    data: current_values['sg_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Japan',
    data: current_values['jp_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Korea',
    data: current_values['kr_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Czechia',
    data: current_values['cz_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );
dataset.push( {
    label: 'Italy',
    data: current_values['it_100'],
    spanGaps: true,
    borderWidth: 3,
    borderColor: '#' + infected_pal[dataset.length],
    pointStyle: 'circle',
    pointBorderColor:  '#' + infected_pal[dataset.length],
    tension: 0,
    fill: false
} );

// The compare_100 chart
window.compare_100= new Chart(compare_100, {
    type: 'line',
    data: {
        labels: labels_relative,
        datasets: dataset,
    },
    options: {
        aspectRatio: aspect_ratio,
        title: {
            display: true,
            text: ["Confirmed cases of COVID-19 in Japan, Czechia, Korea, Singapore, Italy relative by day of first 100 cases", "(click on the legend to show/hide data)"]
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
        },
    }
});
// hide Italy;
window.compare_100.data.datasets[4].hidden = true;
window.compare_100.update();
