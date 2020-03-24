// the graph
var full = document.getElementById("full").getContext('2d');
var graph_height = window.innerHeight * 0.83;
var grd = full.createLinearGradient(0, graph_height,  0,  0);
var country_name = 'Czech republic';
var models = ['Projekcia'];
var chart_max = {};
chart_max['Projekcia'] = get_max(model['Projekcia']['rate']);
var pal = palette('mpn65', 1);
var labels = [];
for (var i=1; i<MAXDAYS; i++) {
    labels.push(i);
}

// HEX to R,G,B - taken from http://www.javascripter.net/faq/hextorgb.htm
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

// HEX to RGBA
function hexToRGBA(h, alpha) {
    return "rgba(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + "," + alpha + ")";
}

// This takes care of data array switching and chart titles
// when choosing different substances
function change_substance(substance) {
    for (var i=0; i< window.myChart.data.datasets.length; i++) {
        var sensor_id = sensor_ids[i];
        if (data[sensor_id][substance]) {
            window.myChart.data.datasets[i].data = data[sensor_id][substance];
        } else {
            window.myChart.data.datasets[i].data = [];
        }
    }
    // change the chart title
    window.myChart.options.title.text = city_name + " " + substance.toUpperCase() + " (last 30 days)";
    // change active button color
    for (var i=0; i< city_substances.length; i++) {
        if (city_substances[i] == substance) {
            document.getElementById(city_substances[i]).style.backgroundColor = 'gold';
        } else {
            document.getElementById(city_substances[i]).style.backgroundColor = 'yellow';
        }
    }
    // change max chart values
    window.myChart.options.scales.yAxes[0].ticks.max = chart_max[substance];

    if (!city_chart) {
        // change chart gradient
        grd = full.createLinearGradient(0, graph_height,  0,  0);
        grd = change_thresholds(substance, grd);
        window.myChart.data.datasets[0].backgroundColor = grd;
    }

    // update chart
    window.myChart.update();
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

// The chart
window.myChart = new Chart(full, {
    type: 'line',
    data: { labels: labels,
    datasets: [ {
        label: 'Current model',
        data: model['Projekcia']['total'],
        spanGaps: true,
        borderWidth: 1,
        borderColor: '#0000EE',
        pointStyle: 'cross',
        pointBackgroundColor: 'rgb(0,0,0)',
        pointBorderColor: 'rgb(0,0,0)',
        tension: 0.2
    }
]
},
    options: {
        title: {
            display: true,
            text: 'Infected, CZ'
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
                    max: get_max(model['Projekcia']['total'])                    }
            }]
        },
        legendCallback: legendcallback,
        legend: {
            display: true
        }
    }
});
