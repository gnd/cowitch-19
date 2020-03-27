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

// Function fills initial arrays:
//  - infected_confirmed:
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
    arr[name]['infected_confirmed'] = [];
    arr[name]['infected_daily'] = [];
    arr[name]['growth_rate'] = [];
    arr[name]['growth_rate_avg'] = [];
    arr[name]['growth_rate_avg_7'] = [];

    // seed the arr[name]ays
    arr[name]['infected_confirmed'] = values[name];
    arr[name]['infected_daily'].push( arr[name]['infected_confirmed'][0] );
    arr[name]['growth_rate'].push( 1 );
    arr[name]['growth_rate_avg'].push( 1 );
    arr[name]['growth_rate_avg_7'].push( 1 );

    elapsed = arr[name]['infected_confirmed'].length;
    for (var i=1; i < elapsed; i++) {
        /// compute daily new cases
        arr[name]['infected_daily'].push( arr[name]['infected_confirmed'][i] - arr[name]['infected_confirmed'][i-1] );

        /// compute daily growth rate
        arr[name]['growth_rate'].push( arr[name]['infected_confirmed'][i] / arr[name]['infected_confirmed'][i-1] );

        /// compute daily average growth rate
        arr[name]['growth_rate_avg'].push( avg_growth_rate( arr[name]['growth_rate'].slice(0,i+1) ) );

        /// compute rolling average growth rate for last 7 days
        slice_start = Math.min(i, 7);
        arr[name]['growth_rate_avg_7'].push( avg_growth_rate( arr[name]['growth_rate'].slice(i-slice_start,i+1) ) );
    }

    return elapsed;
}


function create_seeds(seed_arr, elapsed, name) {
    seed_arr['rate'][name] = {};
    seed_arr['new'][name] = {};
    for (var i=0; i < elapsed[name]; i++) {
        seed['rate'][name][i] = data[name]['growth_rate'][i];
        seed['new'][name][i] = data[name]['infected_confirmed'][i];
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
// 1% mortality
function dead(arr) {
    sum = 0;
    sum += 0.001 * arr[0]; // day 30
    sum += 0.001 * arr[1];
    sum += 0.001 * arr[2];
    sum += 0.001 * arr[3];
    sum += 0.001 * arr[4];
    sum += 0.001 * arr[5];
    sum += 0.001 * arr[6];
    sum += 0.001 * arr[7];
    sum += 0.001 * arr[8];
    sum += 0.001 * arr[9]; // day 20
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

// Compute average if JITTER_COUNT > 1
function get_average_jitter(params) {
    model[params.name]['rate']['avg'] = [];
    model[params.name]['total']['avg'] = [];
    model[params.name]['healed_cum']['avg'] = [];
    for (i=0; i<params.model_duration; i++) {
        rate = 0;
        total = 0;
        healed_cum = 0;
        for (j=0; j<params.jitter_count; j++) {
            rate += model[params.name]['rate'][j][i];
            total += model[params.name]['total'][j][i];
            healed_cum += model[params.name]['healed_cum'][j][i];
        }
        model[params.name]['rate']['avg'].push( rate / params.jitter_count );
        model[params.name]['total']['avg'].push( total / params.jitter_count );
        model[params.name]['healed_cum']['avg'].push( healed_cum / params.jitter_count );
    }
}

// Sort of struct emulation in js
function params(name, model_duration, growth_rate_seed, decay_func, decay_speed, decay_min, new_seed, jitter_count, jitter_amount, health_func, dead_func) {
    this.name = name;
    this.model_duration = model_duration;
    this.irs = growth_rate_seed;
    this.decay_func = decay_func;
    this.decay_speed = decay_speed;
    this.decay_min = decay_min;
    this.new_seed = new_seed;
    this.jitter_count = jitter_count;
    this.jitter_amount = jitter_amount;
    this.health_func = health_func;
    this.dead_func = dead_func;
}

function run_model(params) {
    // setup arrays
    model[params.name] = {};
    model[params.name]['rate'] = {};
    model[params.name]['new'] = {};
    model[params.name]['daily'] = {};
    model[params.name]['healed'] = {};
    model[params.name]['healed_cum'] = {};
    model[params.name]['deaths'] = {};
    model[params.name]['deaths_cum'] = {};
    model[params.name]['total'] = {};
    model[params.name]['total_sick'] = {}; //debug array

    for (jitter=0; jitter<params.jitter_count; jitter++) {

        // setup more arrays
        model[params.name]['rate'][jitter] = [];
        model[params.name]['new'][jitter] = [];
        model[params.name]['daily'][jitter] = [3];
        model[params.name]['healed'][jitter] = [0];
        model[params.name]['healed_cum'][jitter] = [0];
        model[params.name]['deaths'][jitter] = [0];
        model[params.name]['deaths_cum'][jitter] = [0];
        model[params.name]['total'][jitter] = [0];
        model[params.name]['total_sick'][jitter] = [0]; //debug array

        // seed & compute growth rate
        for (var i=0; i < params.model_duration; i++) {
            // if we have provided a value, use it
            if (i in params.irs) {
                model[params.name]['rate'][jitter].push( params.irs[i] );
            } else {
                // otherwise determine next value from the previous one
                // we need to seed at least the first value
                if (i > 0) {
                    // decrease by log(day_number)/speed
                    if (params.decay_func == 'log') {
                        new_rate = model[params.name]['rate'][jitter][i-1] - log_decrease(i+1, params.decay_speed);
                    }
                    if (params.decay_func == 'lin') {
                        new_rate = model[params.name]['rate'][jitter][i-1];
                    }
                    // add some jitter
                    if (params.jitter_amount > 0) {
                        rnd = 1  + (Math.random()*params.jitter_amount*2) - (params.jitter_amount);
                        new_rate *= rnd;
                    }
                    // check if new_rate over allowed min
                    new_rate = Math.max( new_rate, params.decay_min );

                    // add rate into model
                    model[params.name]['rate'][jitter].push( new_rate );
                }
            }
        }

        // compute the projected
        healed_cumulative = 0;
        died_cumulative = 0;
        for (var i=0; i < params.model_duration; i++) {
            var new_infected, new_daily, healed, died, total;

            // New
            if (i in params.new_seed) {
                new_infected = params.new_seed[i];
                model[params.name]['new'][jitter].push( new_infected );
                if (params.name == 'model_kr2') {
                    console.log("new["+jitter+"]["+i+"] = " + new_infected);
                }
            } else {
                // new infected are yesterda's total * yesterdays growth rate
                new_infected = model[params.name]['rate'][jitter][i-1] * model[params.name]['total'][jitter][i-1];
                model[params.name]['new'][jitter].push( new_infected );
                if (params.name == 'model_kr2') {
                    console.log("new["+jitter+"]["+i+"] = " + model[params.name]['rate'][jitter][i-1] + " * " + model[params.name]['total'][jitter][i-1] + " = "+new_infected);
                }
            }

            if (i > 0) {
                // New per day
                new_daily = Math.max(model[params.name]['new'][jitter][i] - model[params.name]['total'][jitter][i-1], 0);
                model[params.name]['daily'][jitter].push( new_daily );
                if (params.name == 'model_kr2') {
                    console.log("daily["+jitter+"]["+i+"] = " + model[params.name]['new'][jitter][i] + " - " + model[params.name]['total'][jitter][i-1] + " = " + new_daily);
                }
                model[params.name]['total_sick'][jitter].push( model[params.name]['total_sick'][jitter][i-1] + new_daily );

                // Healed per day
                if (params.health_func == 'healthy') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=34; j>10; j--) { // Create and fill the daily array slice starting at current day - 34 and ending at current day - 11
                        if (i-j > 0) {
                            daily_slice[34-j] = model[params.name]['daily'][jitter][i-j];
                        }
                    }
                    healed = healthy(daily_slice);
                } else
                if (params.health_func == 'healthy_new') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=36; j>12; j--) { // Create and fill the daily array slice starting at current day - 34 and ending at current day - 11
                        if (i-j > 0) {
                            daily_slice[36-j] = model[params.name]['daily'][jitter][i-j];
                        }
                    }
                    healed = healthy_new(daily_slice);
                }
                healed_cumulative += healed;
                model[params.name]['healed'][jitter].push( healed );
                model[params.name]['healed_cum'][jitter].push( healed_cumulative );

                // Deaths per day
                if (params.dead_func == 'dead') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=30; j>19; j--) { // Create and fill the daily array slice starting at current day - 30 and ending at current day - 20
                        if (i-j > 0) {
                            daily_slice[30-j] = model[params.name]['daily'][jitter][i-j];
                        }
                    }
                    died = dead(daily_slice);
                } else
                if (params.dead_func == 'dead_new') {
                    daily_slice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j=11; j>6; j--) { // Create and fill the daily array slice starting at current day - 20 and ending at current day - 15
                        if (i-j > 0) {
                            daily_slice[11-j] = model[params.name]['daily'][jitter][i-j];
                        }
                    }
                    died = dead_new(daily_slice);
                }
                died_cumulative += died;
                model[params.name]['deaths'][jitter].push( died );
                model[params.name]['deaths_cum'][jitter].push( died_cumulative );

                // Total = New - Healed - Died
                total = new_infected - healed - died;
                model[params.name]['total'][jitter].push( total );
                if (params.name == 'model_kr2') {
                    console.log("total["+jitter+"]["+i+"] = " + new_infected + " - " + healed + " - " + died + " = " + total);
                }

                // Log to console
                rate = model[params.name]['rate'][jitter][i];
                //console.log((i+1)+' rate: '+rate.toFixed(2)+' new: '+new_infected.toFixed(0)+' day: '+new_daily.toFixed(0)+' healed: '+healed.toFixed(0)+' total: '+total.toFixed(0) + ' died: '+died.toFixed(0))
            }
        }
    }

    // Compute average
    if (params.jitter_count > 1) {
        get_average_jitter(params);
    }
}
