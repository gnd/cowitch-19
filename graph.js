// HEX to R,G,B - taken from http://www.javascripter.net/faq/hextorgb.htm
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

// HEX to RGBA
function hexToRGBA(h, alpha) {
    return "rgba(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + "," + alpha + ")";
}

// create a legendCallback - see: https://github.com/chartjs/Chart.js/issues/2565
function legendcallback(chart) {
    var legendHtml = [];
    legendHtml.push('<table>');
    legendHtml.push('<tr>');
    for (var i=0; i<chart.data.datasets.length; i++) {
        legendHtml.push('<td><div class="chart-legend" style="background-color:' + chart.data.datasets[i].borderColor + '"></div></td>');
        if (chart.data.datasets[i].label) {
            legendHtml.push(
                '<td class="chart-legend-label-text" onclick="updateDataset(event, ' + '\'' + chart.legend.legendItems[i].datasetIndex + '\'' + ')">'
                 + chart.data.datasets[i].label + '</td>');
        }
    }
    legendHtml.push('</tr>');
    legendHtml.push('</table>');
    return legendHtml.join("");
}

// generate palette
var infected_pal = palette('mpn65', 6);

// generate labels
var labels = [];
for (var i=1; i<MAXDAYS; i++) {
    labels.push( moment(new Date(2020, 02, i)) );
}

// the infected graph
var infected_chart = document.getElementById("infected").getContext('2d');
var graph_height = window.innerHeight * 0.83;
var country_name = 'Czech republic';
var models = ['Projekcia'];
chart_max = Math.max(get_max(model['projection']['total']), get_max(model['projection-optimistic']['total']));

// The infected chart
window.myChart = new Chart(infected_chart, {
    type: 'line',
    data: { labels: labels,
    datasets: [
    {
        label: 'Confirmed cases',
        data: current_values,
        spanGaps: true,
        borderWidth: 3,
        borderColor: '#' + infected_pal[1],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[1],
        tension: 0,
        fill: false
    },
    {
        label: 'Standard model',
        data: model['projection']['total'],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: '#' + infected_pal[0],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[0],
        tension: 0.2,
        fill: false
    },
    {
        label: 'Optimistic model',
        data: model['projection-optimistic']['total'],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: '#' + infected_pal[2],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[2],
        tension: 0.2,
        fill: false
    }
]
},
    options: {
        title: {
            display: true,
            text: 'Current confirmed and predicted cases of COVID-19 in Czech republic'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 3500,
                }
            }]
        },
        legendCallback: legendcallback,
        legend: {
            display: true
        }
    }
});

// the growth rate
var growth_rate_chart = document.getElementById("growth_rate").getContext('2d');
var graph_height = window.innerHeight * 0.83;
var country_name = 'Czech republic';
var models = ['Projekcia'];
chart_max = Math.max(get_max(model['projection']['total']), get_max(model['projection-optimistic']['total']));

// The growth rate chart
window.myChart = new Chart(growth_rate_chart, {
    type: 'line',
    data: { labels: labels,
    datasets: [
    {
        label: 'Observed',
        data: data['growth_rate'],
        spanGaps: true,
        borderWidth: 3,
        borderColor: '#' + infected_pal[1],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[1],
        tension: 0.2,
        fill: false
    },
    {
        label: 'Average',
        data: data['growth_rate_avg'],
        spanGaps: true,
        borderWidth: 2,
        borderColor: '#' + infected_pal[3],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[3],
        tension: 0.2,
        fill: false
    },
    {
        label: 'Standard model',
        data: model['projection']['rate'],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: '#' + infected_pal[0],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[0],
        tension: 0.2,
        fill: false
    },
    {
        label: 'Optimistic model',
        data: model['projection-optimistic']['rate'],
        spanGaps: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: '#' + infected_pal[2],
        pointStyle: 'circle',
        pointBorderColor:  '#' + infected_pal[2],
        tension: 0.2,
        fill: false
    },
]
},
    options: {
        title: {
            display: true,
            text: 'Current confirmed, average and predicted growth rate of COVID-19 in Czech republic'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 3,
                }
            }]
        },
        legendCallback: legendcallback,
        legend: {
            display: true
        }
    }
});
