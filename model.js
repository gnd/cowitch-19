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
function healthy(arr) {
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

function healthy_new(arr) {
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
    sum += 0.1665 * arr[13]; // 0.18 - 0.0135
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
    return sum;
}

// See above
// 1.35 % mortality
function dead_new(arr) {
    sum = 0;
    sum += 0.0027 * arr[0]; // day 11
    sum += 0.0027 * arr[1];
    sum += 0.0027 * arr[2];
    sum += 0.0027 * arr[3];
    sum += 0.0027 * arr[4]; // day 7
    return sum;
}

// See above
// 2 % mortality
function dead_newnew(arr) {
    sum = 0;
    sum += 0.004 * arr[0]; // day 11
    sum += 0.004 * arr[1];
    sum += 0.004 * arr[2];
    sum += 0.004 * arr[3];
    sum += 0.004 * arr[4]; // day 7
    return sum;
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
    return 1 / steps * scale
}

// New rate control functions - log ramp
function log(x, steps, speed, scale) {
    x = (x)*speed;
    if (x > 0) {
        return (Math.log(x+1) / Math.log(steps*speed+1) * scale) - (Math.log(x) / Math.log(steps*speed+1) * scale);
    } else {
        return Math.log(x+1) / Math.log(steps*speed+1) * scale;
    }

}

// New rate control functions - exponential ramp
function exp(x, steps, speed, scale) {
    if (x > 0) {
        // f[x] - f[x-1]
        return ( Math.pow(x,speed) / Math.pow(steps,speed) - Math.pow(x-1,speed) / Math.pow(steps,speed) ) * scale;
    } else {
        return Math.pow(x,speed) / Math.pow(steps,speed) * scale;
    }
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
function fill_initial(arr, values, name) {
    // prepare the arrays
    arr[name] = {}
    arr[name]['infected'] = [];
    arr[name]['infected_daily'] = [];
    arr[name]['growth_rate'] = [];
    arr[name]['growth_rate_avg'] = [];
    arr[name]['growth_rate_avg_7'] = [];

    // seed the arr[name]ays
    arr[name]['infected'] = values[name];
    arr[name]['infected_daily'].push( arr[name]['infected'][0] );
    arr[name]['growth_rate'].push( 1 );
    arr[name]['growth_rate_avg'].push( 1 );
    arr[name]['growth_rate_avg_7'].push( 1 );

    elapsed = arr[name]['infected'].length;
    for (var i=1; i < elapsed; i++) {
        /// compute daily new cases
        arr[name]['infected_daily'].push( arr[name]['infected'][i] - arr[name]['infected'][i-1] );

        /// compute daily growth rate
        arr[name]['growth_rate'].push( arr[name]['infected'][i] / arr[name]['infected'][i-1] );

        /// compute daily average growth rate
        arr[name]['growth_rate_avg'].push( avg_growth_rate( arr[name]['growth_rate'].slice(0,i+1) ) );

        /// compute rolling average growth rate for last 7 days
        slice_start = Math.min(i, 7);
        arr[name]['growth_rate_avg_7'].push( avg_growth_rate( arr[name]['growth_rate'].slice(i-slice_start,i+1) ) );
    }

    return elapsed;
}


function create_seeds(seed_arr, elapsed, name) {
    seed_arr['growth_rate'][name] = {};
    seed_arr['growth_rate_avg_7'][name] = {};
    seed_arr['infected'][name] = {};
    for (var i=0; i < elapsed[name]; i++) {
        seed['growth_rate'][name][i] = data[name]['growth_rate'][i];
        seed['growth_rate_avg_7'][name][i] = data[name]['growth_rate_avg_7'][i];
        seed['infected'][name][i] = data[name]['infected'][i];
    }
}


// Fills current_values[name_100] with current values above 100 cases
// Used in compare_100 graph
function prepare_100(values, name) {
    new_name = name+'_100';
    values[new_name] = [];

    for (i=0; i<values[name].length; i++) {
        if (values[name][i] > 100) {
            values[new_name].push( values[name][i] );
        }
    }
}

// Compute average if JITTER_COUNT > 1
function get_average_jitter(params) {
    model[params.name]['growth_rate']['avg'] = [];
    model[params.name]['recovered']['avg'] = [];
    model[params.name]['total']['avg'] = [];
    model[params.name]['deaths']['avg'] = [];
    for (i=0; i<params.model_duration; i++) {
        rate = 0;
        total = 0;
        deaths = 0;
        recovered = 0;
        for (j=0; j<params.jitter_count; j++) {
            rate += model[params.name]['growth_rate'][j][i];
            recovered += model[params.name]['recovered'][j][i];
            total += model[params.name]['total'][j][i];
            deaths += model[params.name]['deaths'][j][i];
        }
        model[params.name]['growth_rate']['avg'].push( rate / params.jitter_count );
        model[params.name]['recovered']['avg'].push( recovered / params.jitter_count );
        model[params.name]['total']['avg'].push( total / params.jitter_count );
        model[params.name]['deaths']['avg'].push( deaths / params.jitter_count );
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

// Sort of struct emulation in js - model prameters
function params(name, model_duration, growth_rate_seed, growth_rate_min, infected_seed, jitter_count, jitter_amount, health_func, dead_func, rate_funcs, population_size) {
    this.name = name;
    this.model_duration = model_duration;
    this.irs = growth_rate_seed;
    this.growth_rate_min = growth_rate_min;
    this.infected_seed = infected_seed;
    this.jitter_count = jitter_count;
    this.jitter_amount = jitter_amount;
    this.health_func = health_func;
    this.dead_func = dead_func;
    this.rate_funcs = rate_funcs;
    this.population_size = population_size;
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

        // seed & compute growth rate
        for (var i=0; i < params.model_duration; i++) {
            // if we have provided a value, use it
            if (i in params.irs) {
                model[params.name]['growth_rate'][jitter].push( params.irs[i] );
            } else {
                // otherwise determine next value from the previous one
                if (i > 0) {
                    // apply all valid ratefuncs to the current step
                    for (j=0; j<params.rate_funcs.length; j++) {
                        var rate_func = params.rate_funcs[j];
                        if ((rate_func.start <= i) && (i < (rate_func.start + rate_func.steps))) {
                            new_rate = model[params.name]['growth_rate'][jitter][i-1] + window[rate_func.name]( i-rate_func.start, rate_func.steps, rate_func.speed, rate_func.scale );
                        }
                    }
                    // add some jitter
                    if (params.jitter_amount > 0) {
                        rnd = 1  + (Math.random()*params.jitter_amount*2) - (params.jitter_amount);
                        new_rate *= rnd;
                    }
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
                if (params.name == 'cz_c') {
                    console.log('Adding to infected from seed: '+params.infected_seed[i]);
                }
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
                if (params.health_func == 'healthy_new') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=36; j>12; j--) { // Create and fill the daily array slice starting at current day - 34 and ending at current day - 11
                        if (i-j > 0) {
                            daily_slice[36-j] = model[params.name]['infected_daily'][jitter][i-j];
                        }
                    }
                    recovered_daily = healthy_new(daily_slice);
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
                    deaths_daily = dead_new(daily_slice);
                }
                if (params.dead_func == 'dead_newnew') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=11; j>6; j--) { // Create and fill the daily array slice starting at current day - 20 and ending at current day - 15
                        if (i-j > 0) {
                            daily_slice[11-j] = model[params.name]['infected_daily'][jitter][i-j];
                        }
                    }
                    deaths_daily = dead_newnew(daily_slice);
                }
                deaths += deaths_daily;
                model[params.name]['deaths_daily'][jitter].push( deaths_daily );
                model[params.name]['deaths'][jitter].push( deaths );

                // Total = New - recovered_daily - Died
                total = infected - recovered_daily - deaths_daily;
                model[params.name]['total'][jitter].push( total );

                // Susceptible = Susceptible[n-1] - infected - recovered - deaths
                susceptible = model[params.name]['susceptible'][jitter][i-1] - infected_daily - recovered_daily - deaths_daily;
                if (susceptible > 0) {
                    model[params.name]['susceptible'][jitter].push( susceptible );
                } else {
                    model[params.name]['susceptible'][jitter].push( 0 );
                }

                // Log to console
                //if (params.name == 'cz_future_2') {
            //        console.log("i: "+i+" susc-1: "+ model[params.name]['susceptible'][jitter][i-1])
                //    console.log((i+1)+' rate: '+new_rate.toFixed(2)+' infected: '+infected.toFixed(0)+' infected_daily: '+infected_daily.toFixed(0)+' recovered_daily: '+recovered_daily.toFixed(0)+' total: '+total.toFixed(0) + ' died: '+deaths.toFixed(0))
                //}
            }
        }
    }

    // Compute average
    if (params.jitter_count > 1) {
        get_average_jitter(params);
    }
}
