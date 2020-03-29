// HEX to R,G,B - taken from http://www.javascripter.net/faq/hextorgb.htm
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

// HEX to RGBA
function hexToRGBA(h, alpha) {
    return "rgba(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + "," + alpha + ")";
}

// generate palette
var pal_8 = palette('mpn65', 8);

// generate palette
var pal_8_sol = palette('sol-accent', 8);

// generate palette
var pal_10 = palette('tol-rainbow', 10);

// generate palette
var pal_18 = palette('mpn65', 18);

// generate labels
function gen_days(start_day, start_month, count) {
    var labels = [];
    for (var i=1; i<count; i++) {
        labels.push( moment(new Date(2020, start_month, start_day+i)) );
    }
    return labels;
}

// generate labels
function gen_days_relative(count) {
    var labels_relative = [];
    for (var i=1; i<count; i++) {
        labels_relative.push( "Day "+i );
    }
    return labels_relative;
}

// default legend callback - see https://www.chartjs.org/docs/latest/configuration/legend.html
function legendCallback(e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    meta = ci.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    ci.update();
}

// Extract data from CSV arrays
function extract_data(csv, current, country, dest_name) {
    var now = moment(new Date());
    var start = moment("2020-1-22");
    var duration = moment.duration(now.diff(start));
    var days = duration.asDays()

    // prepare arrays
    current[dest_name] = [];
    current[dest_name + '_confirmed'] = [];
    current[dest_name + '_recovered'] = [];
    current[dest_name + '_deaths'] = [];


    for (i=0; i<days-1; i++) {
        column = moment(new Date(2020, 0, 22 + i)).format('M/D/YY');    // data starting from 1/22/20

        // extract confirmed
        current[dest_name + '_confirmed'].push( csv['confirmed'][country][column] );

        // extract recovered
        current[dest_name + '_recovered'].push( csv['recovered'][country][column] );

        // extract deaths
        current[dest_name + '_deaths'].push( csv['deaths'][country][column] );

        // push into dest_name array
        current[dest_name].push( current[dest_name + '_confirmed'][i] - current[dest_name + '_recovered'][i] - current[dest_name + '_deaths'][i] );
    }
}

function detect_client() {
    const mq = window.matchMedia('screen and (min-width: 300px) and (max-width: 340px)');
    if (mq.matches) {
        aspect_ratio = aspect_ratio_mobile;
    }
    const mq2 = window.matchMedia('screen and (min-width: 341px) and (max-width: 365px)');
    if (mq2.matches) {
        aspect_ratio = aspect_ratio_mobile;
    }
    const mq3 = window.matchMedia('screen and (min-width: 370px) and (max-width: 380px)');
    if (mq3.matches) {
        aspect_ratio = aspect_ratio_mobile;
    }
    const mq4 = window.matchMedia('screen and (min-width: 400px) and (max-width: 1000px)');
    if (mq4.matches) {
        aspect_ratio = aspect_ratio_mobile;
    }
};

detect_client();
