// This computes the amount of people getting healthy on a given day
// Earliest recovery is after 11 days, latest recovery after 35 days
// For data these two studies were used:
//      [1] Wang et al., Clinical Characteristics of 138 Hospitalized Patients With 2019 Novel Coronavirus–Infected Pneumonia in Wuhan, China,
//          doi:10.1001/jama.2020.1585
//      [2] Huang et al., Clinical features of patients infected with 2019 novel coronavirus in Wuhan, China
//          https://doi.org/10.1016/S0140-6736(20)30183-5
//
// We use this kind of distribution [3]:
// 80% - 14-17 days - mild cases
// 6% - 18-20 days - hospitalisation, median time to admission 10 days, median time to release 10 days
// 13% - 21-35 days - severe hospitalisation
// 1% - day 20-30 - dead
//
// To make things simpler the above can be represented like this:
// 1,2,3,7,18,20,17,14,4,3,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,1,1,1,1
//
// Where the first number is the percentage of healed cases on day 11, the next one is the percentage of healed on day 12, and so on
//
// This makes for a nice smooth curve which fullfills the above criteria [3].
// The 0.9% on days 20-30 makes up for 1% death rate - so far Covid-19 has been having a low death rate in CZ (also in neighboring DE)..
//
// For easier handling, we send in an array of daily infected people starting 34 days before,
// and ending 11 days before the day we try to compute number of healed persons
function get_recovered(arr) {
    sum = 0;
    sum += 0.01 * arr[0]; // day 34
    sum += 0.01 * arr[1];
    sum += 0.01 * arr[2];
    sum += 0.01 * arr[3];
    sum += 0.009 * arr[4];
    sum += 0.009 * arr[5];
    sum += 0.009 * arr[6];
    sum += 0.009 * arr[7];
    sum += 0.009 * arr[8];
    sum += 0.009 * arr[9];
    sum += 0.009 * arr[10];
    sum += 0.009 * arr[11];
    sum += 0.009 * arr[12];
    sum += 0.009 * arr[13];
    sum += 0.03 * arr[14];
    sum += 0.04 * arr[15];
    sum += 0.14 * arr[16];
    sum += 0.17 * arr[17];
    sum += 0.20 * arr[18];
    sum += 0.18 * arr[19];
    sum += 0.07 * arr[20];
    sum += 0.03 * arr[21];
    sum += 0.02 * arr[22];
    sum += 0.01 * arr[23]; // day 11
    return sum;
}

// recovered is normalized to 100%, we need scale it down to 1-CFR
function get_recovered_new(arr, cfr) {
    sum = 0;
    sum += 0.01 * arr[0]; // day 34
    sum += 0.01 * arr[1];
    sum += 0.01 * arr[2];
    sum += 0.01 * arr[3];
    sum += 0.01 * arr[4];
    sum += 0.01 * arr[5];
    sum += 0.01 * arr[6];
    sum += 0.01 * arr[7];
    sum += 0.01 * arr[8];
    sum += 0.01 * arr[9];
    sum += 0.01 * arr[10];
    sum += 0.02 * arr[11];
    sum += 0.07 * arr[12];
    sum += 0.18 * arr[13];
    sum += 0.17 * arr[14];
    sum += 0.11 * arr[15];
    sum += 0.09 * arr[16];
    sum += 0.07 * arr[17];
    sum += 0.06 * arr[18];
    sum += 0.04 * arr[19];
    sum += 0.03 * arr[20];
    sum += 0.02 * arr[21];
    sum += 0.02 * arr[22];
    sum += 0.01 * arr[23];  // day 11
    return sum * (1-cfr);
}

// See above
// Scaled to 1%
function get_dead_new(arr, cfr) {
    sum = 0;
    sum += 0.0027 * arr[0]; // day 11
    sum += 0.0027 * arr[1];
    sum += 0.0027 * arr[2];
    sum += 0.0027 * arr[3];
    sum += 0.0027 * arr[4]; // day 7
    return sum * cfr * 100;
}


// Lognormal distribution according to
// Linton et al - Incubation Period and Other Epidemiological Characteristics of 2019 Novel Coronavirus Infections with Right Truncation: A Statistical Analysis of Publicly Available Case Data
// DOI 10.3390/jcm9020538
// Scaled to 1%
function get_dead_linton(arr, cfr) {
    sum = 0;
    sum += 0.0025 * 0.01895735 * arr[0]; // day 27
    sum += 0.0025 * 0.01895735 * arr[1];
    sum += 0.0025 * 0.01895735 * arr[2];
    sum += 0.005 * 0.01895735 * arr[3];
    sum += 0.0075 * 0.01895735 * arr[4];
    sum += 0.01 * 0.01895735 * arr[5];
    sum += 0.0125 * 0.01895735 * arr[6];
    sum += 0.015 * 0.01895735 * arr[7];
    sum += 0.02 * 0.01895735 * arr[8];
    sum += 0.025 * 0.01895735 * arr[9];
    sum += 0.03 * 0.01895735 * arr[10];
    sum += 0.035 * 0.01895735 * arr[11];
    sum += 0.04 * 0.01895735 * arr[12];
    sum += 0.045 * 0.01895735 * arr[13];
    sum += 0.0475 * 0.01895735 * arr[14];
    sum += 0.05 * 0.01895735 * arr[15];
    sum += 0.05 * 0.01895735 * arr[16];
    sum += 0.0475 * 0.01895735 * arr[17];
    sum += 0.04 * 0.01895735 * arr[18];
    sum += 0.025 * 0.01895735 * arr[19];
    sum += 0.01 * 0.01895735 * arr[20];
    sum += 0.005 * 0.01895735 * arr[21]; // day 6
    return sum * cfr * 100;
}

// Get maximum value for array
function get_max(arr) {
    max = 0;
    for (var i=0; i < arr.length; i++) {
        max = Math.max( arr[i], max );
    }
    return max;
}

// This is a logarithm base 10
function log_decrease(day, speed) {
    return Math.log10(day)/speed;
}

// This is a logarithm base 10
function lin_decrease(day, speed) {
    return day/speed;
}

// This computes the average growth rate for days with data
function avg_growth_rate(data) {
    var sum = 0;
    for (var i=0; i < data.length; i++) {
        sum += data[i];
    }
    return sum / data.length;
}

// New rate control functions - linear ramp
function lin(x, steps, speed, scale) {
    // return (x / steps * scale) - ((x-1) / steps * scale); this can be simplified to:
    return 1 / steps * scale;
}

// New rate control functions - log ramp
function log(x, steps, speed, scale) {
    var xp = (x-1)*speed;
    var xc = (x)*speed;
    if (x > 0) {
        prev = Math.log(xp+1) / Math.log(steps*speed+1);
        curr = Math.log(xc+1) / Math.log(steps*speed+1);
        return (curr - prev) * scale;
    } else {
        return Math.log(x+1) / Math.log(steps*speed+1) * scale;
    }
}

// New rate control functions - exponential ramp
function exp(x, steps, speed, scale) {
    if (x > 0) {
        // f[x] - f[x-1]
        return ( Math.pow(x,speed) - Math.pow(x-1,speed) ) / Math.pow(steps, speed) * scale;
    } else {
        return Math.pow(x,speed) / Math.pow(steps,speed) * scale;
    }
}

function sig(x, steps, speed, scale) {
    // we need to move the function so that (1/(1+Math.pow(steep, -x))) < 1/1000
    x += Math.log10(Math.abs(scale)/1000) / Math.log10(speed);
    nextval = (1 / (1 + Math.pow(speed, -x+1)));
    currval = (1 / (1 + Math.pow(speed, -x)));
    return (currval-nextval) * scale;
}

// Rate control processing function that simulates weekly oscilation
function saw(dow, scale, offset) {
    var value = 0;
        
    switch (dow%7) {
        case 0:
            // Sunday's results published on Monday
            value = scale * -0.3;
        break;
        case 1:
            // Monday's results published on Tuesday
            value = 0;
        break;
        case 2:
            // Tuesday's results
            value = scale * (0.25-(Math.random()/20));
        break;
        case 3:
            // Wednesday's results
            value = scale * (0.25+(Math.random()/20));
        break;
        case 4:
            // Thursday's results
            value = scale * (0.025-(Math.random()/20));
        break;
        case 5:
            // Friday's results
            value = scale * -0.1;
        break;
        case 6:
            // Saturday's results published on Sunday
            value = scale * -0.2;
        break;
    }
    
    return value;
}

// old func for compatibility
function old_log(day, steps, speed, scale) {
    return Math.log10(day) / speed * scale;
}

// Function fills initial arrays:
//  - infected:
//      how many persons are confirmed infected, cumulative, eg.:
//      [3,3,5,7] - 3 on day 1, 3 on day 2, 5 on day 3, 7 n day 4
//  - infected_daily:
//      daily increase of infected confirmed, eg.:
//      [3,0,2,4] - 3 new on day 1, 0 new on day 2, 2 new on day 3, 4 new on day 4
//  - growth_rate:
//      the ratio of infected confirmed on day n+1 to confirmed infected on day n, eg:
//      [1,1,1.66,1.4]
//  - growth_rate_avg:
//      average on growth_rate over all values up to i:
//      [1, 1, 1.22, 1.26]
//  - growth_rate_avg_7:
//      seven day rolling average of growth_rate
//
//  These data are used to seed the model
function fill_initial(arr, values, name, offset = 0) {
    // prepare the arrays
    arr[name] = {}
    arr[name]['infected'] = []; // infected = confirmed - recovered - dead
    arr[name]['confirmed'] = [];
    arr[name]['growth_rate'] = [];
    arr[name]['growth_rate_avg'] = [];
    arr[name]['growth_rate_avg_7'] = [];

    // seed the arr[name]ays
    arr[name]['infected'] = values[name].slice(offset);  // infected = confirmed - recovered - dead
    arr[name]['confirmed'] = values[name+'_confirmed'].slice(offset);
    arr[name]['growth_rate'].push( 1 );
    arr[name]['growth_rate_avg'].push( 1 );
    arr[name]['growth_rate_avg_7'].push( 1 );

    elapsed = arr[name]['confirmed'].length;
    console.log(name + " len: " + elapsed);
    for (var i=1; i < elapsed; i++) {
        // compute daily growth rate - we use confirmed as opposed to infected so that the growth rate doesnt fall under 1, which is just how this model works
        // we dont want to model the dissapearance of the epidemy, as that is a fundamentaly different process, we just model the spread, where the lowest spread between days is 1, when no one new got infected

        // Note 18.9.2020
        // This is the wrong approach because cumulative numbers get big over time, so currently the actuall growth rate is computed like this:
        // Growth rate: 1.0762968018720749 ( 44154 / 41024)
        // Which is wrong, because the day to day change was almost 3000, and growth rate should be ~1.16
        /* Disabling old calculation
        if ( arr[name]['confirmed'][i-1] == 0 ) {
            arr[name]['growth_rate'].push( 1 );
        } else {
            arr[name]['growth_rate'].push( arr[name]['confirmed'][i] / arr[name]['confirmed'][i-1] );
            var gr = arr[name]['confirmed'][i] / arr[name]['confirmed'][i-1];
            console.log("Growth rate: " + gr + " ( " + arr[name]['confirmed'][i] + "/ " + arr[name]['confirmed'][i-1] + ")")
        }
        */

        // Newly we take just the infected growth rate into account
        if ( arr[name]['infected'][i-1] == 0 ) {
            arr[name]['growth_rate'].push( 1 );
        } else {
            arr[name]['growth_rate'].push( arr[name]['infected'][i] / arr[name]['infected'][i-1] );
            var gr = arr[name]['infected'][i] / arr[name]['infected'][i-1];
        }

        // compute daily average growth rate
        arr[name]['growth_rate_avg'].push( avg_growth_rate( arr[name]['growth_rate'].slice(0,i+1) ) );

        // compute rolling average growth rate for last 7 days
        slice_start = Math.min(i, 7);
        arr[name]['growth_rate_avg_7'].push( avg_growth_rate( arr[name]['growth_rate'].slice(i-slice_start,i+1) ) );
    }

    return elapsed;
}


function create_seeds(seed_arr, elapsed, name, offset = 0) {
    seed_arr['growth_rate'][name] = {};
    seed_arr['growth_rate_avg_7'][name] = {};
    seed_arr['infected'][name] = {};
    for (var i=0; i < elapsed[name]; i++) {
        seed['growth_rate'][name][i-offset] = data[name]['growth_rate'][i];
        seed['growth_rate_avg_7'][name][i-offset] = data[name]['growth_rate_avg_7'][i];
        seed['infected'][name][i-offset] = data[name]['infected'][i];
    }
}


// Fills current_values[name_100] with current values above 100 cases
// Used in compare_100 graph
function prepare_100(values, name) {
    new_name = name+'_100';
    new_name_conf = name+'_100_confirmed';
    values[new_name] = [];
    values[new_name_conf] = [];

    for (i=0; i<values[name].length; i++) {
        if (values[name][i] > 100) {
            values[new_name].push( values[name][i] );
            values[new_name_conf].push( values[name+'_confirmed'][i] );
        }
    }
}


// Fills current_values[name_100] with current values above 100 cases
// Relative by 100k people
// Used in compare_100 graph
function prepare_100_relative(values, name, population) {
    new_name = name+'_100';
    new_name_conf = name+'_100_confirmed';
    new_name_perc = name+'_100_confirmed_perc';
    new_name_deaths_conf = name+'_100_deaths';
    new_name_deaths_perc = name+'_100_deaths_perc';
    new_name_deaths_daily = name+'_100_deaths_daily';
    values[new_name] = [];
    values[new_name_conf] = [];
    values[new_name_perc] = [];
    values[new_name_deaths_conf] = [];
    values[new_name_deaths_perc] = [];
    values[new_name_deaths_daily] = [];

    for (i=0; i<values[name].length; i++) {
        if (values[name][i] > 100) {
            values[new_name].push( values[name][i] * 100000 / population );
            values[new_name_conf].push( values[name+'_confirmed'][i] * 100000 / population );
            values[new_name_perc].push( values[name+'_confirmed'][i] * 100 / population );
            values[new_name_deaths_conf].push( values[name+'_deaths'][i] * 100000 / population );
            values[new_name_deaths_perc].push( values[name+'_deaths'][i] * 100 / population );
            values[new_name_deaths_daily].push( values[name+'_deaths_daily'][i] * 100000 / population );
        }
    }
}


// Fills current_values[name_100] with current values above 100 cases
// Used in compare_100 graph
function prepare_1(values, name) {
    new_name = name+'_1';
    new_name_conf = name+'_1_confirmed';
    values[new_name] = [];
    values[new_name_conf] = [];

    for (i=0; i<values[name].length; i++) {
        if (values[name][i] > 1) {
            values[new_name].push( values[name][i] );
            values[new_name_conf].push( values[name+'_confirmed'][i] );
        }
    }
}


// Compute average if JITTER_COUNT > 1
function get_average_jitter(params, debug) {
    model[params.name]['growth_rate']['avg'] = [];
    model[params.name]['recovered']['avg'] = [];
    model[params.name]['total']['avg'] = [];
    model[params.name]['total_reported']['avg'] = [];
    model[params.name]['deaths']['avg'] = [];
    for (i=0; i<params.model_duration; i++) {
        rate = 0;
        total = 0;
        total_reported = 0;
        deaths = 0;
        recovered = 0;
        
        if (debug) {
            log = "Total[" + i + "]: ";
        }
        for (j=0; j<params.jitter_count; j++) {
            rate += model[params.name]['growth_rate'][j][i];
            recovered += model[params.name]['recovered'][j][i];
            total += model[params.name]['total'][j][i];
            total_reported += model[params.name]['total_reported'][j][i];
            deaths += model[params.name]['deaths'][j][i];
            
            if (debug) {
                log += model[params.name]['total'][j][i] + ", ";
            }
        }
        model[params.name]['growth_rate']['avg'].push( rate / params.jitter_count );
        model[params.name]['recovered']['avg'].push( recovered / params.jitter_count );
        model[params.name]['total']['avg'].push( total / params.jitter_count );
        model[params.name]['total_reported']['avg'].push( total_reported / params.jitter_count );
        model[params.name]['deaths']['avg'].push( deaths / params.jitter_count );
        
        if (debug) {
            console.log( log + "=== " + (total / params.jitter_count));
        }
    }
}

// Sort of struct emulation in js - rate function parameters
function rate_func(name, start, steps, speed, scale) {
    this.name = name;
    this.start = start;
    this.steps = steps;
    this.speed = speed;
    this.scale = scale;
}

// Sort of struct emulation in js - postprocessing function parameters
function post_func(name, param1, param2, param3) {
    this.name = name;
    this.param1 = param1;
    this.param2 = param2;
}

// Sort of struct emulation in js - model prameters
function params(name, model_duration, growth_rate_seed, growth_rate_min, infected_seed, jitter_count, jitter_amount, recovered_func, recovered_offset, dead_func, cfr, rate_funcs, post_funcs = false, population_size, real_to_reported, debug) {
    this.name = name;
    this.model_duration = model_duration;
    this.irs = growth_rate_seed;
    this.growth_rate_min = growth_rate_min;
    this.infected_seed = infected_seed;
    this.jitter_count = jitter_count;
    this.jitter_amount = jitter_amount;
    this.recovered_func = recovered_func;
    this.recovered_offset = recovered_offset;
    this.dead_func = dead_func;
    this.cfr = cfr;
    this.rate_funcs = rate_funcs;
    this.post_funcs = post_funcs;
    this.population_size = population_size;
    this.reported_ratio = real_to_reported;
    this.debug = debug;
}

function run_model(params) {
    // setup arrays
    model[params.name] = {};
    model[params.name]['growth_rate'] = {};
    model[params.name]['susceptible'] = {};
    model[params.name]['infected'] = {};
    model[params.name]['infected_daily'] = {};
    model[params.name]['infected_cumulative'] = {};
    model[params.name]['recovered'] = {};
    model[params.name]['recovered_daily'] = {};
    model[params.name]['deaths'] = {};
    model[params.name]['deaths_daily'] = {};
    model[params.name]['total'] = {};
    model[params.name]['total_reported'] = {};

    for (jitter=0; jitter<params.jitter_count; jitter++) {

        // setup more arrays
        model[params.name]['growth_rate'][jitter] = [];
        model[params.name]['susceptible'][jitter] = [params.population_size];
        model[params.name]['infected'][jitter] = [];
        model[params.name]['infected_daily'][jitter] = [3];
        model[params.name]['infected_cumulative'][jitter] = [0];
        model[params.name]['recovered'][jitter] = [0];
        model[params.name]['recovered_daily'][jitter] = [0];
        model[params.name]['deaths'][jitter] = [0];
        model[params.name]['deaths_daily'][jitter] = [0];
        model[params.name]['total'][jitter] = [0];
        model[params.name]['total_reported'][jitter] = [0];

        // seed & compute growth rate
        for (var i=0; i < params.model_duration; i++) {
            // if we have provided a value, use it
            if (i in params.irs) {
                model[params.name]['growth_rate'][jitter].push( params.irs[i] );
            } else {
                // otherwise determine next value from the previous one
                if (i > 0) {
                    var new_rate = 0;
                    // apply all valid ratefuncs to the current step
                    for (j=0; j<params.rate_funcs.length; j++) {
                        var rate_func = params.rate_funcs[j];
                        if ((rate_func.start <= i) && (i < (rate_func.start + rate_func.steps))) {
                            new_rate = model[params.name]['growth_rate'][jitter][i-1] + window[rate_func.name]( i-rate_func.start, rate_func.steps, rate_func.speed, rate_func.scale );
                        }
                    }
                    // post-processing
                    for (j=0; j<params.post_funcs.length; j++) {
                        var post_func = params.post_funcs[j];
                        new_rate += window[post_func.name]( i+post_func.param1, post_func.param2 );
                    }
                    // add some jitter
                    if (params.jitter_amount > 0) {
                        rnd = 1  + (Math.random()*params.jitter_amount*2) - (params.jitter_amount);
                        new_rate *= rnd;
                    }
                    // just for logging purposes
                    computed_new_rate = new_rate;
                    // check if new_rate over allowed min 
                    new_rate = Math.max( new_rate, params.growth_rate_min );
                    // add rate into model
                    model[params.name]['growth_rate'][jitter].push( new_rate );
                }
            }
        }

        // compute the projected
        recovered = 0;
        deaths = 0;
        for (var i=0; i < params.model_duration; i++) {
            var infected, infected_daily, recovered_daily, deaths_daily, total;

            // Numbers of infected from the model seed
            if (i in params.infected_seed) {
                infected = params.infected_seed[i];
                model[params.name]['infected'][jitter].push( infected );
            } else {
                // new infected are yesterday's total * yesterdays growth rate
                // but only if we didnt reach the susceptible limit
                if (model[params.name]['susceptible'][jitter][i-1] > 0) {
                    infected = model[params.name]['growth_rate'][jitter][i-1] * model[params.name]['total'][jitter][i-1];
                    model[params.name]['infected'][jitter].push( infected );
                } else {
                    infected = model[params.name]['total'][jitter][i-1];
                    model[params.name]['infected'][jitter].push( infected );
                }
            }

            if (i > 0) {
                // New infected per day
                infected_daily = Math.max(model[params.name]['infected'][jitter][i] - model[params.name]['total'][jitter][i-1], 0);
                model[params.name]['infected_daily'][jitter].push( infected_daily );
                model[params.name]['infected_cumulative'][jitter].push( model[params.name]['infected_cumulative'][jitter][i-1] + infected_daily );

                // Recovered per day
                if (params.recovered_func == 'recovered_new') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    var start = params.recovered_offset - 24;
                    for (var j=params.recovered_offset; j>start; j--) { // Create and fill the daily array slice starting at current day - 34 and ending at current day - 11
                        if (i-j > 0) {
                            daily_slice[params.recovered_offset-j] = model[params.name]['infected_daily'][jitter][i-j];
                        }
                    }
                    recovered_daily = get_recovered_new(daily_slice, params.cfr);
                }
                recovered += recovered_daily;
                model[params.name]['recovered_daily'][jitter].push( recovered_daily );
                model[params.name]['recovered'][jitter].push( recovered );

                // Deaths per day
                if (params.dead_func == 'dead_new') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=11; j>6; j--) { // Create and fill the daily array slice starting at current day - 20 and ending at current day - 15
                        if (i-j > 0) {
                            daily_slice[11-j] = model[params.name]['infected_daily'][jitter][i-j];
                        }
                    }
                    deaths_daily = get_dead_new(daily_slice, params.cfr);
                }
                if (params.dead_func == 'linton') {
                    // Create and fill the daily array slice starting at current day - 27 and ending at current day - 6
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=27; j>5; j--) {
                        if (i-j > 0) {
                            daily_slice[27-j] = model[params.name]['infected_daily'][jitter][i-j];
                        }
                    }
                    deaths_daily = get_dead_linton(daily_slice, params.cfr);
                }
                deaths += deaths_daily;
                model[params.name]['deaths_daily'][jitter].push( deaths_daily );
                model[params.name]['deaths'][jitter].push( deaths );

                // Total = New - recovered_daily - Died - but only when we are predicting
                if (i in params.infected_seed) {
                    total = infected;
                } else {
                    total = infected - recovered_daily - deaths_daily;
                }
                var total_reported = total / params.reported_ratio;
                if (total > 0) {
                    model[params.name]['total'][jitter].push( total );
                    model[params.name]['total_reported'][jitter].push( total_reported );
                } else {
                    // Lets have always some sick to keep the model going
                    model[params.name]['total'][jitter].push( 10000 );
                    model[params.name]['total_reported'][jitter].push( 10000 );
                }

                // Susceptible = Susceptible[n-1] - infected - recovered - deaths
                susceptible = model[params.name]['susceptible'][jitter][i-1] - infected_daily - recovered_daily - deaths_daily;
                if (susceptible > 0) {
                    model[params.name]['susceptible'][jitter].push( susceptible );
                } else {
                    model[params.name]['susceptible'][jitter].push( 0 );
                }

                // Log to console 
                if (params.debug) {
                    console.log("i: "+i+" susc-1: "+ model[params.name]['susceptible'][jitter][i-1])
                    console.log((i+1)+' computed_new_rate: '+computed_new_rate.toFixed(2)+' rate: '+new_rate.toFixed(2)+' infected: '+infected.toFixed(0)+' infected_daily: '+infected_daily.toFixed(0)+' recovered_daily: '+recovered_daily.toFixed(0)+' died: '+deaths.toFixed(0)+' died_daily: '+deaths_daily.toFixed(0)+' total: '+total.toFixed(0));
                }
            }
        }
    }

    // Compute average
    if (params.jitter_count > 1) {
        get_average_jitter(params, params.debug);
    }
}
