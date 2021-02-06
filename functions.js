age_slots = ['18','25','30','35','40','45','50','55','60','65','70','75','80'];
age_slots_desc = ['18-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','65-69','70-74','75-79','80+'];
used_vaccines = ['Pfizer', 'Moderna', 'other'];

// HEX to R,G,B - taken from http://www.javascripter.net/faq/hextorgb.htm
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

// HEX to RGBA
function hexToRGBA(h, alpha) {
    return "rgba(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + "," + alpha + ")";
}

// Dump actual data about country
function dump_country(name) {
    console.log(current_values[name + '_confirmed']);
    console.log(current_values[name + '_recovered']);
    console.log(current_values[name + '_deaths']);
    console.log(current_values[name]);
}

// generate palette
var pal_8 = palette('mpn65', 8);

// generate palette
var pal_8_sol = palette('sol-accent', 8);

// generate palette
var pal_10 = palette('tol-rainbow', 10);

// generate palette
var pal_18 = palette('mpn65', 18);

// generate palette
var pal_21 = palette('mpn65', 24);

// generate rainbow pallete for first vaccination round
var pal_vacc_a = palette('rainbow', 13, 0);

// generate rainbow pallete for second vaccination round
var pal_vacc_b = palette('rainbow', 13, 1);

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
    current[dest_name + '_deaths_daily'] = [];


    for (i=0; i<days-1; i++) {
        column = moment(new Date(2020, 0, 22 + i)).format('M/D/YY');    // data starting from 1/22/20
        

        // extract confirmed
        current[dest_name + '_confirmed'].push( csv['confirmed'][country][column] );

        // extract recovered
        current[dest_name + '_recovered'].push( csv['recovered'][country][column] );

        // extract deaths
        current[dest_name + '_deaths'].push( csv['deaths'][country][column] );
        
        // extract daily deaths
        if (i > 0) {
            previous_column = moment(new Date(2020, 0, 21 + i)).format('M/D/YY');
            current[dest_name + '_deaths_daily'].push( csv['deaths'][country][column] - csv['deaths'][country][previous_column] );
        }
        
        // push into dest_name array
        current[dest_name].push( current[dest_name + '_confirmed'][i] - current[dest_name + '_recovered'][i] - current[dest_name + '_deaths'][i] );
    }
}

// Extract data from Czech CSV arrays
function extract_data_cz(csv, current, dest_name) {
    var now = moment(new Date());
    var start = moment("2020-3-1");
    var duration = moment.duration(now.diff(start));
    var days = duration.asDays()

    // prepare arrays
    current[dest_name] = [];
    current[dest_name + '_confirmed'] = [];
    current[dest_name + '_recovered'] = [];
    current[dest_name + '_deaths'] = [];
    current[dest_name + '_deaths_daily'] = [];
    current[dest_name + '_tests'] = [];

    for (i=0; i<days; i++) {
        column = moment(new Date(2020, 2, 0 + i)).format('M/D/YY');    // data starting from 3/1/20

        // extract confirmed
        current[dest_name + '_confirmed'].push( csv['confirmed'][column] );

        // extract recovered
        current[dest_name + '_recovered'].push( csv['recovered'][column] );

        // extract deaths
        current[dest_name + '_deaths'].push( csv['deaths'][column] );
        
        // extract daily deaths
        if (i > 0) {
            previous_column = moment(new Date(2020, 2, 0 + i - 1)).format('M/D/YY');
            current[dest_name + '_deaths_daily'].push( csv['deaths'][column] - csv['deaths'][previous_column] );
        }

        // extract tests
        current[dest_name + '_tests'].push( csv['tests'][column] );

        // push into dest_name array
        current[dest_name].push( current[dest_name + '_confirmed'][i] - current[dest_name + '_recovered'][i] - current[dest_name + '_deaths'][i] );
    }
}

// Extract data from Czech CSV arrays - vaccinations detailed info
function extract_vaccinated_cz_details(csv, current, dest_name) {
    var now = moment(new Date());
    var start = moment("2020-12-27");
    var duration = moment.duration(now.diff(start));
    var days = duration.asDays()

    // Process data about vaccinations broken down by age groups
    for (var i=0; i<age_slots.length; i++) {
        var age = age_slots[i];        
        // prepare arrays - first round of vaccinations
        current[dest_name + '_vaccinated_a_' + age] = [];
        current[dest_name + '_vaccinated_b_' + age] = [];
        current[dest_name + '_vaccinated_a_daily_' + age] = [];
        current[dest_name + '_vaccinated_b_daily_' + age] = [];
        for (var j=0; j<days; j++) {
            column = moment(new Date(2020, 11, 27 + j)).format('M/D/YY');    // data starting from 12/27/20
            // extract vaccinated
            current[dest_name + '_vaccinated_a_' + age].push( csv['vaccinated_a_' + age][column] );
            current[dest_name + '_vaccinated_b_' + age].push( csv['vaccinated_b_' + age][column] );
            
            // extract daily numbers
            if (j>1) {
                previous_column = moment(new Date(2020, 11, 26 + j)).format('M/D/YY');    // data starting from 12/27/20
                // extract vaccinated
                current[dest_name + '_vaccinated_a_daily_' + age].push( csv['vaccinated_a_' + age][column] - csv['vaccinated_a_' + age][previous_column] );
                current[dest_name + '_vaccinated_b_daily_' + age].push( csv['vaccinated_b_' + age][column] - csv['vaccinated_b_' + age][previous_column] );
            }
        }
    }
    
    // Now do the totals
    current[dest_name + '_vaccinated_a_total'] = [];
    current[dest_name + '_vaccinated_b_total'] = [];
    for (var j=0; j<days; j++) {
        column = moment(new Date(2020, 11, 27 + j)).format('M/D/YY');    // data starting from 12/27/20
        // extract vaccinated
        current[dest_name + '_vaccinated_a_total'].push( csv['vaccinated_a_total'][column] );
        current[dest_name + '_vaccinated_b_total'].push( csv['vaccinated_b_total'][column] );
    }
    
    // Process data about vaccinations broken down by vaccine types
    for (var i=0; i<used_vaccines.length; i++) {
        var vaccine = used_vaccines[i];        
        // prepare arrays - first round of vaccinations
        current[dest_name + '_vaccinated_a_' + vaccine] = [];
        current[dest_name + '_vaccinated_b_' + vaccine] = [];
        current[dest_name + '_vaccinated_a_daily_' + vaccine] = [];
        current[dest_name + '_vaccinated_b_daily_' + vaccine] = [];
        for (var j=0; j<days; j++) {
            column = moment(new Date(2020, 11, 27 + j)).format('M/D/YY');    // data starting from 12/27/20
            // extract vaccinated
            current[dest_name + '_vaccinated_a_' + vaccine].push( csv['vaccinated_a_' + vaccine][column] );
            current[dest_name + '_vaccinated_b_' + vaccine].push( csv['vaccinated_b_' + vaccine][column] );
            
            // extract daily numbers
            if (j>1) {
                previous_column = moment(new Date(2020, 11, 26 + j)).format('M/D/YY');    // data starting from 12/27/20
                // extract vaccinated
                current[dest_name + '_vaccinated_a_daily_' + vaccine].push( csv['vaccinated_a_' + vaccine][column] - csv['vaccinated_a_' + vaccine][previous_column] );
                current[dest_name + '_vaccinated_b_daily_' + vaccine].push( csv['vaccinated_b_' + vaccine][column] - csv['vaccinated_b_' + vaccine][previous_column] );
            }
        }
    }
}

// Extract data from Slovak CSV arrays
function extract_data_sk(csv, current, dest_name) {
    var now = moment(new Date());
    var start = moment("2020-3-6");
    var duration = moment.duration(now.diff(start));
    var days = duration.asDays()

    // prepare arrays
    current[dest_name] = [];
    current[dest_name + '_confirmed'] = [];
    current[dest_name + '_recovered'] = [];
    current[dest_name + '_deaths'] = [];
    current[dest_name + '_deaths_daily'] = [];
    current[dest_name + '_tests'] = [];

    for (i=0; i<days; i++) {
        column = moment(new Date(2020, 2, 6 + i)).format('M/D/YY');    // data starting from 3/1/20

        // extract confirmed
        current[dest_name + '_confirmed'].push( csv['confirmed'][column] );

        // extract recovered
        current[dest_name + '_recovered'].push( csv['recovered'][column] );

        // extract deaths
        current[dest_name + '_deaths'].push( csv['deaths'][column] );
        
        // extract daily deaths
        if (i > 0) {
            previous_column = moment(new Date(2020, 2, 5 + i)).format('M/D/YY');
            current[dest_name + '_deaths_daily'].push( csv['deaths'][column] - csv['deaths'][previous_column] );
        }

        // extract tests
        current[dest_name + '_tests'].push( csv['tests'][column] );

        // push into dest_name array
        current[dest_name].push( current[dest_name + '_confirmed'][i] - current[dest_name + '_recovered'][i] - current[dest_name + '_deaths'][i] );
    }
}



function detect_client() {
    const mq = window.matchMedia('screen and (min-width: 300px) and (max-width: 340px)');
    if (mq.matches) {
        aspect_ratio = aspect_ratio_mobile;
        fontsize = fontsize_mobile;
    }
    const mq2 = window.matchMedia('screen and (min-width: 341px) and (max-width: 365px)');
    if (mq2.matches) {
        aspect_ratio = aspect_ratio_mobile;
        fontsize = fontsize_mobile;
    }
    const mq3 = window.matchMedia('screen and (min-width: 370px) and (max-width: 380px)');
    if (mq3.matches) {
        aspect_ratio = aspect_ratio_mobile;
        fontsize = fontsize_mobile;
    }
    const mq4 = window.matchMedia('screen and (min-width: 400px) and (max-width: 1000px)');
    if (mq4.matches) {
        aspect_ratio = aspect_ratio_mobile;
        fontsize = fontsize_mobile;
    }
};
