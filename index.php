<html>
<head>
<title>
    cowitch-19 - epidemiological witch-doctory
</title>

<!-- META -->
<meta charset="UTF-8">
<meta id="description" content="Epidemiological witch-doctory / datamancy / Covid-19 fortune telling" />
<meta id="keywords" content="covid-19 czechia czech republic quarantine pandemy epidemy corona coronavirus graph model" />
<meta id="revisit-after" content="1 days" />
<meta id="viewport" content="width=device-width,initial-scale=1" />

<!-- OPEN GRAPH -->
<meta property="og:locale" content="en_EN" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Cowitch-19" />
<meta property="og:description" content="Epidemiological witch doctory / datamancy / Covid-19 fortune telling" />
<meta property="og:url" content="co.witch19.space" />
<meta property="og:image" content="https://co.witch19.space/corona-chan-black.jpg" />
<meta property="og:image:secure_url" content="https://co.witch19.space/corona-chan-black.jpg" />

<!-- MOMENT.JS -->
<script src="moment.js"></script>

<!-- CHART.JS & PLUGINS-->
<script src="Chart.min.js"></script>
<script src="chartjs-plugin-annotation.min.js"></script>

<!-- PALETTE.JS -->
<script src="palette.js"></script>

<!-- FUNCTIONS -->
<script src="functions.js?v=<?php echo filemtime('functions.js'); ?>"></script>

<!-- MOBILE & DESKTOP STYLES -->
<link rel="stylesheet" media='screen and (min-width: 300px) and (max-width: 340px)' href="mobile.css?v=<?php echo filemtime('mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 341px) and (max-width: 365px)' href="mobile.css?v=<?php echo filemtime('mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 370px) and (max-width: 380px)' href="mobile.css?v=<?php echo filemtime('mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 400px) and (max-width: 1000px)' href="mobile.css?v=<?php echo filemtime('mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 1001px) and (max-width: 1300px)' href="desktop.css?v=<?php echo filemtime('desktop.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 1301px) and (max-width: 1599px)' href="desktop.css?v=<?php echo filemtime('desktop.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 1600px)' href="desktop.css?v=<?php echo filemtime('desktop.css'); ?>"/>

<!-- MODEL -->
<script src="model.js?v=<?php echo filemtime('model.js'); ?>"></script>

<!-- DATA -->
<script src="data/confirmed.js?v=<?php echo filemtime('data/confirmed.js'); ?>"></script>
<script src="data/recovered.js?v=<?php echo filemtime('data/recoveredz.js'); ?>"></script>
<script src="data/deaths.js?v=<?php echo filemtime('data/deaths.js'); ?>"></script>
<script src="data/confirmed_cz.js?v=<?php echo filemtime('data/confirmed_cz.js'); ?>"></script>
<script src="data/recovered_cz.js?v=<?php echo filemtime('data/recovered_cz.js'); ?>"></script>
<script src="data/deaths_cz.js?v=<?php echo filemtime('data/deaths_cz.js'); ?>"></script>
<script src="data/tests_cz.js?v=<?php echo filemtime('data/tests_cz.js'); ?>"></script>
<script src="data/vaccinated_cz_details.js?v=<?php echo filemtime('data/vaccinated_cz_details.js'); ?>"></script>
<script src="data/confirmed_sk.js?v=<?php echo filemtime('data/confirmed_sk.js'); ?>"></script>
<script src="data/recovered_sk.js?v=<?php echo filemtime('data/recovered_sk.js'); ?>"></script>
<script src="data/deaths_sk.js?v=<?php echo filemtime('data/deaths_sk.js'); ?>"></script>
<script src="data/tests_sk.js?v=<?php echo filemtime('data/tests_sk.js'); ?>"></script>


<?php
    // compute last change to the model(s)
    $max_code = filemtime('index.php');
    $max_code = max($max_code, filemtime('graph.js'));
    $max_code = max($max_code, filemtime('model.js'));
    // compute last change to the data
    $max_data = filemtime('data/deaths.js');
    $max_data = max($max_data, filemtime('data/deaths_cz.js'));
?>

<!-- SEED AND PREPARE MODELS AND GRAPHS -->
<script>
    aspect_ratio = 2; // Desktop graph aspect ratio
    aspect_ratio_mobile = 1.15; // Mobile graph aspect ratio
    fontsize = 12;
    fontsize_mobile = 24;
    moment.suppressDeprecationWarnings = true;

    // Create the data arrays using values
    data = {};
    current_values = {};
    days_elapsed = {};
    seed = {'growth_rate': {}, 'growth_rate_avg_7': {}, 'infected': {}};
    population_size = {};

    population_size['at'] =  8858775; // https://en.wikipedia.org/wiki/Demographics_of_Austria
    population_size['be'] = 11550039; // https://en.wikipedia.org/wiki/Demographics_of_Belgium
    population_size['bg'] =  6951482; // https://en.wikipedia.org/wiki/Demographics_of_Bulgaria
    population_size['cr'] =  4067500; // https://en.wikipedia.org/wiki/Demographics_of_Croatia
    population_size['cz'] = 10693939; // https://en.wikipedia.org/wiki/Demographics_of_the_Czech_Republic
    population_size['fr'] = 67153000; // https://en.wikipedia.org/wiki/Demographics_of_France
    population_size['de'] = 83122889; // https://en.wikipedia.org/wiki/Demographics_of_Germany
    population_size['gr'] = 10718565; // https://en.wikipedia.org/wiki/Demographics_of_Greece
    population_size['hu'] =  9798000; // https://en.wikipedia.org/wiki/Demographics_of_Hungary
    population_size['it'] = 60317116; // https://en.wikipedia.org/wiki/Demographics_of_Italy
    population_size['nl'] = 17469635; // https://en.wikipedia.org/wiki/Demography_of_the_Netherlands
    population_size['pl'] = 37846611; // https://en.wikipedia.org/wiki/Demographics_of_Poland
    population_size['pt'] = 10295909; // https://en.wikipedia.org/wiki/Demographics_of_Portugal
    population_size['ro'] = 19317384; // https://en.wikipedia.org/wiki/Demographics_of_Romania
    population_size['sk'] =  5464000; // https://en.wikipedia.org/wiki/Demographics_of_Slovakia
    population_size['sl'] =  2100126; // https://en.wikipedia.org/wiki/Demographics_of_Slovenia
    population_size['sr'] =  6926705; // https://en.wikipedia.org/wiki/Demographics_of_Serbia
    population_size['es'] = 47431256; // https://en.wikipedia.org/wiki/Demographics_of_Spain
    population_size['ua'] = 41762138; // https://en.wikipedia.org/wiki/Demographics_of_Ukraine

    // Get global data from https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
    extract_data(global_data, current_values, 'Austria', 'at');
    extract_data(global_data, current_values, 'Belgium', 'be');
    extract_data(global_data, current_values, 'Bulgaria', 'bg');
    extract_data(global_data, current_values, 'Croatia', 'cr');
    extract_data_cz(czech_data, current_values, 'cz'); // Get Czech data from https://onemocneni-aktualne.mzcr.cz/covid-19
    extract_vaccinated_cz_details(czech_data, current_values, 'cz'); // Get Czech data from https://onemocneni-aktualne.mzcr.cz/covid-19
    extract_data(global_data, current_values, 'France', 'fr');
    extract_data(global_data, current_values, 'Germany', 'de');
    extract_data(global_data, current_values, 'Greece', 'gr');
    extract_data(global_data, current_values, 'Hungary', 'hu');
    extract_data(global_data, current_values, 'Italy', 'it');
    extract_data(global_data, current_values, 'Netherlands', 'nl');
    extract_data(global_data, current_values, 'Poland', 'pl');
    extract_data(global_data, current_values, 'Portugal', 'pt');
    extract_data(global_data, current_values, 'Romania', 'ro');
    extract_data_sk(slovak_data, current_values, 'sk'); // Get Slovak data from https://mapa.covid.chat/export/csv
    extract_data(global_data, current_values, 'Slovenia', 'sl');
    extract_data(global_data, current_values, 'Serbia', 'sr');
    extract_data(global_data, current_values, 'Spain', 'es');
    extract_data(global_data, current_values, 'Ukraine', 'ua');
    
    // Fill initial stats for countries
    days_elapsed['at'] = fill_initial(data, current_values, 'at');
    days_elapsed['be'] = fill_initial(data, current_values, 'be');
    days_elapsed['bg'] = fill_initial(data, current_values, 'bg');
    days_elapsed['cr'] = fill_initial(data, current_values, 'cr');
    days_elapsed['cz'] = fill_initial(data, current_values, 'cz');
    days_elapsed['fr'] = fill_initial(data, current_values, 'fr');
    days_elapsed['de'] = fill_initial(data, current_values, 'de');
    days_elapsed['gr'] = fill_initial(data, current_values, 'gr');
    days_elapsed['hu'] = fill_initial(data, current_values, 'hu');
    days_elapsed['it'] = fill_initial(data, current_values, 'it');
    days_elapsed['nl'] = fill_initial(data, current_values, 'nl');
    days_elapsed['pl'] = fill_initial(data, current_values, 'pl');
    days_elapsed['pt'] = fill_initial(data, current_values, 'pt');
    days_elapsed['ro'] = fill_initial(data, current_values, 'ro');
    days_elapsed['sk'] = fill_initial(data, current_values, 'sk');
    days_elapsed['sl'] = fill_initial(data, current_values, 'sl');
    days_elapsed['sr'] = fill_initial(data, current_values, 'sr');
    days_elapsed['es'] = fill_initial(data, current_values, 'es');
    days_elapsed['ua'] = fill_initial(data, current_values, 'ua');

    // prepare values for compare_100
    prepare_100_relative(current_values, 'at', population_size['at']);
    prepare_100_relative(current_values, 'be', population_size['be']);
    prepare_100_relative(current_values, 'bg', population_size['bg']);
    prepare_100_relative(current_values, 'cr', population_size['cr']);
    prepare_100_relative(current_values, 'cz', population_size['cz']);
    prepare_100_relative(current_values, 'fr', population_size['fr']);
    prepare_100_relative(current_values, 'de', population_size['de']);
    prepare_100_relative(current_values, 'gr', population_size['gr']);
    prepare_100_relative(current_values, 'hu', population_size['hu']);
    prepare_100_relative(current_values, 'it', population_size['it']);
    prepare_100_relative(current_values, 'nl', population_size['nl']);
    prepare_100_relative(current_values, 'pl', population_size['pl']);
    prepare_100_relative(current_values, 'pt', population_size['pt']);
    prepare_100_relative(current_values, 'ro', population_size['ro']);
    prepare_100_relative(current_values, 'sk', population_size['sk']);
    prepare_100_relative(current_values, 'sl', population_size['sl']);
    prepare_100_relative(current_values, 'sr', population_size['sr']);
    prepare_100_relative(current_values, 'es', population_size['es']);
    prepare_100_relative(current_values, 'ua', population_size['ua']);

    // Prepare the model
    model = {};
    JITTER_COUNT = 50;
    JITTER_AMOUNT = 0.015;

    // What do we even model here ? Right, young padawan, nothing. This model has no claim to reality
    // The data we try to aproximate are imprecise, incomplete measurements, obtained with a dubious methodology and abysmal success rates.
    // Modelling Covid-19 is like trying to glimpse reality through a broken and distorted plastic mirror taken out from a trash heap..

    // Create growth_rate seed and new cases seed for modelling
    create_seeds(seed, days_elapsed, 'cz');
    create_seeds(seed, days_elapsed, 'sk');
    
    // This is a model following the 7-day rolling average of growth rate in Czech republic
    // TODO define a suite of realistic rate functions for autumn
    rate_funcs = [];
    post_funcs = [];
    var PREDICTION_DAY = 181;
    var MASKS_IN_PUBLIC_TRANSPORT = 183; // day 183 is 1.9.2020
    var MASKS_INSIDE = 200; // day 200 is 18.9.2020
    var SECOND_LOCKDOWN = 214; // day 214 is 1.10.2020
    // rate of growth rises on its own
    // rationale is R of corona estimated between 2 and 2.5
    // Here we use 2.2 within 100 days, using a slightly exponential curve
    // .. which is already quite mellow, and understateent, meaning the results should be pointing to a minimal spread
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY,                        // start
        100,                        // steps
        1.4,                        // speed / steepness
        1.2,                        // scale
    ));
    // slowdown due to restrictions: (1.9 masks in public transport)
    // rationale is that a full use of masks everywhere would hinder cca 90% of transmissions
    // which i lack any data for and TODO would be nice to find an article how masks reduce infection probability
    // laymans computation was that if without masks A get 100% of B's particles, and vice versa
    // with A and B masked they get only 10% of each others particles
    // However this applies to public transport only, which makes up - again im fabulating - only 10% of social interactions in a day
    // However these interactions are between strangers, so they accelerate spread, so lets say its 15%
    // 15% of 1.2 is 0.18 = 0.2 = 1+0.2 = 1.2 (1 is baseline here)
    // lol, what did you expect, this is just fortunetelling :)
    rate_funcs.push( new rate_func(
        'lin',                      // name
        MASKS_IN_PUBLIC_TRANSPORT,                        // start
        150,                        // steps
        1,                        // speed / steepness
        1.2,                        // scale
    ));
    // slowdown due to restrictions (masks inside curfew on bars
    // same rationale as above
    rate_funcs.push( new rate_func(
        'lin',                      // name
        MASKS_INSIDE,                        // start
        150,                        // steps
        1,                        // speed / steepness
        0.3,                        // scale
    ));
    // panic measures and semi-complete lockdown in czechia starting from 1st of october
    // rationale
    rate_funcs.push( new rate_func(
        'exp',                      // name
        SECOND_LOCKDOWN,                        // start
        200,                        // steps
        .45,                        // speed / steepness
        -0.4,                        // scale
    ));
    // here we use only first N days to be able to freeze predictions in time
    var model_growthrate = {};
    var model_seed = {};
    for (i=0; i<=PREDICTION_DAY; i++) {
        model_growthrate[i] = seed['growth_rate_avg_7']['cz'][i];
        model_seed[i] = seed['infected']['cz'][i];
    }
    var model_settings = new params(
        'cz_c',                     // model name
        390,                        // model duration
        //seed['growth_rate_avg_7']['cz'],
        model_growthrate,
        0.95,                       // min possible growth rate
        //seed['infected']['cz'],      // the confirmed cases so far
        model_seed,
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                         // recovered offset - when to start looking into the past for current recoveries
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        post_funcs,
        population_size['cz'],
        1,                          // ratio of reported cases out of real cases (max 1)
        0                           // debugging
    );
    run_model( model_settings );


    // 31.10.2020
    // This is a model following the 7-day rolling average of growth rate in Czech republic
    rate_funcs = [];
    var PREDICTION_DAY = 205; // Day 214 is 1.10.2020
    var SECOND_LOCKDOWN = 236; // day 214 is 1.11.2020
    // rate of growth rises on its own
    // rationale is R of corona estimated between 2 and 2.5
    // Here we use 2.2 within 100 days, using a slightly exponential curve
    // .. which is already quite mellow, and understateent, meaning the results should be pointing to a minimal spread
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY,             // start
        100,                        // steps
        0.4,                        // speed / steepness
        0.02,                        // scale
    ));
    rate_funcs.push( new rate_func(
        'exp',                      // name
        SECOND_LOCKDOWN,             // start
        150,                        // steps
        1,                        // speed / steepness
        -0.3,                        // scale
    ));
    // here we use only first N days to be able to freeze predictions in time
    var model_growthrate = {};
    var model_seed = {};
    for (i=0; i<=PREDICTION_DAY; i++) {
        model_growthrate[i] = seed['growth_rate_avg_7']['cz'][i];
        model_seed[i] = seed['infected']['cz'][i];
    }
    var model_settings_31_10 = new params(
        'cz_31-10',                     // model name
        390,                        // model duration
        //seed['growth_rate_avg_7']['cz'],
        model_growthrate,
        0.95,                       // min possible growth rate
        //seed['infected']['cz'],      // the confirmed cases so far
        model_seed,
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                         // recovered offset - when to start looking into the past for current recoveries
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        post_funcs,
        population_size['cz'],
        1,                          // ratio of reported cases out of real cases (max 1)
        0                           // debugging
    );
    run_model( model_settings_31_10 );
    
    
    // 27.12.2020
    // This is a model following the 7-day rolling average of growth rate in Czech republic
    rate_funcs = [];
    var PREDICTION_DAY = 304; // Day 304 is 30.12.2020
    rate_funcs.push( new rate_func(
        'log',                      // name
        PREDICTION_DAY,             // start
        14,                        // steps
        .1,                        // speed / steepness
        0.03,                        // scale
    ));
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY+7,             // start
        30,                        // steps
        1.2,                        // speed / steepness
        -0.2,                        // scale
    ));
    
    // 27.12
    var model_growthrate = {};
    var model_seed = {};
    for (i=0; i<=PREDICTION_DAY; i++) {
        model_growthrate[i] = seed['growth_rate_avg_7']['cz'][i];
        model_seed[i] = seed['infected']['cz'][i];
    }
    var model_settings_27_12 = new params(
        'cz_27-12',                     // model name
        390,                        // model duration
        //seed['growth_rate_avg_7']['cz'],
        model_growthrate,
        0.95,                       // min possible growth rate
        //seed['infected']['cz'],      // the confirmed cases so far
        model_seed,
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                         // recovered offset - when to start looking into the past for current recoveries
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        post_funcs,
        population_size['cz'],
        1,                          // ratio of reported cases out of real cases (max 1)
        0                           // debugging
    );
    run_model( model_settings_27_12 );
    
    
    // 1.1.2021
    // This is a model following the 7-day rolling average of growth rate in Slovakia
    rate_funcs = [];
    var PREDICTION_DAY = 300; // Day 304 is 30.12.2020
    rate_funcs.push( new rate_func(
        'log',                      // name
        PREDICTION_DAY,             // start
        14,                        // steps
        .1,                        // speed / steepness
        0.06,                        // scale
    ));
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY+7,             // start
        50,                        // steps
        1.2,                        // speed / steepness
        -0.2,                        // scale
    ));
    
    // 1.1.2021
    var model_growthrate = {};
    var model_seed = {};
    for (i=0; i<=PREDICTION_DAY; i++) {
        model_growthrate[i] = seed['growth_rate_avg_7']['sk'][i];
        model_seed[i] = seed['infected']['sk'][i];
    }
    var model_settings_1_1_sk = new params(
        'sk_1-1',                     // model name
        390,                        // model duration
        //seed['growth_rate_avg_7']['cz'],
        model_growthrate,
        0.95,                       // min possible growth rate
        //seed['infected']['cz'],      // the confirmed cases so far
        model_seed,
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                         // recovered offset - when to start looking into the past for current recoveries
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        post_funcs,
        population_size['sk'],
        1,                          // ratio of reported cases out of real cases (max 1)
        0                           // debugging
    );
    run_model( model_settings_1_1_sk );
    
    // 05.01.2021
    // This is a model following the growth rate in Czech republic
    // Updated 16/01 - following avg7 growth rate seems better in retrospect
    rate_funcs = [];
    var PREDICTION_DAY = 310; // Day 310 is 05.01.2021
    rate_funcs.push( new rate_func(
        'log',                      // name
        PREDICTION_DAY,             // start
        4,                        // steps
        .1,                        // speed / steepness
        0.01,                        // scale
    ));
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY+3,             // start
        70,                         // steps
        1.1,                        // speed / steepness
        -0.25,                        // scale
    ));
    // 4th Wave
    rate_funcs.push( new rate_func(
        'lin',                      // name
        PREDICTION_DAY+60,             // start
        100,                        // steps
        1.2,                        // speed / steepness
        0.45,                        // scale
    ));
    // 4th Lockdown
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY+100,             // start
        30,                        // steps
        1.2,                        // speed / steepness
        -0.3,                        // scale
    ));
    // Add some postprocessing
    post_funcs = [];
    post_funcs.push( new post_func(
        'saw',      // this adds a weekly oscilation to the growth rate
        0,          // dow 
        0.2         // scale
    ));
    
    // 05.01
    var model_growthrate = {};
    var model_seed = {};
    for (i=0; i<=PREDICTION_DAY; i++) {
        model_growthrate[i] = seed['growth_rate_avg_7']['cz'][i];
        model_seed[i] = seed['infected']['cz'][i];
    }
    var model_settings_05_01 = new params(
        'cz_05-01',                     // model name
        450,                        // model duration
        //seed['growth_rate_avg_7']['cz'],
        model_growthrate,
        0.9,                       // min possible growth rate
        //seed['infected']['cz'],      // the confirmed cases so far
        model_seed,
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                         // recovered offset - when to start looking into the past for current recoveries
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        post_funcs,
        population_size['cz'],
        1,                          // ratio of reported cases out of real cases (max 1)
        0                           // debugging
    );
    run_model( model_settings_05_01 );


    // 13.02.2021 (modified 28.02.2021)
    // Updating the 05.01 model to accomodate for the 4th wave
    // Keeping the prediction date same, just expanding on the former model
    rate_funcs = [];
    var PREDICTION_DAY = 310; // Day 310 is 05.01.2021
    rate_funcs.push( new rate_func(
        'log',                      // name
        PREDICTION_DAY,             // start
        4,                        // steps
        .1,                        // speed / steepness
        0.01,                        // scale
    ));
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY+2,             // start
        15,                         // steps
        1.1,                        // speed / steepness
        -0.08,                        // scale
    ));
    // 4th Wave - came much sooner than expected
    var FOURTH_WAVE = PREDICTION_DAY+10; // set to 16.01
    rate_funcs.push( new rate_func(
        'lin',                      // name
        FOURTH_WAVE,                // start
        60,                        // steps
        1.2,                        // speed / steepness
        0.350,                        // scale
    ));
    // 4th Lockdown
    rate_funcs.push( new rate_func(
        'exp',                      // name
        FOURTH_WAVE+48,             // start (guessing 22.02.2021) in the ned a week later - 01.03.2021
        20,                         // steps
        1.2,                        // speed / steepness
        -0.282,                       // scale
    ));
    // 5th Wave
    var FIFTH_WAVE = PREDICTION_DAY+70; // set to 04.03
    rate_funcs.push( new rate_func(
        'lin',                      // name
        FIFTH_WAVE,                // start
        51,                        // steps
        1.2,                        // speed / steepness
        0.44,                        // scale
    ));
    // 5th Lockdown
    rate_funcs.push( new rate_func(
        'exp',                      // name
        FIFTH_WAVE+31,          // start (guessing 20.02.2021)
        20,                        // steps
        1.2,                        // speed / steepness
        -0.3,                        // scale
    ));
    // Add some postprocessing
    post_funcs = [];
    post_funcs.push( new post_func(
        'saw',      // this adds a weekly oscilation to the growth rate
        0,          // dow 
        0.26        // scale
    )); 
    
    // 13.02
    var model_growthrate = {};
    var model_seed = {};
    for (i=0; i<=PREDICTION_DAY; i++) {
        model_growthrate[i] = seed['growth_rate_avg_7']['cz'][i];
        model_seed[i] = seed['infected']['cz'][i];
    }
    var model_settings_13_02 = new params(
        'cz_13-02',                     // model name
        450,                        // model duration
        //seed['growth_rate_avg_7']['cz'],
        model_growthrate,
        0.9,                       // min possible growth rate
        //seed['infected']['cz'],      // the confirmed cases so far
        model_seed,
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/64,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                         // recovered offset - when to start looking into the past for current recoveries
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        post_funcs,
        population_size['cz'],
        1,                          // ratio of reported cases out of real cases (max 1)
        0                           // debugging
    );
    run_model( model_settings_13_02 );

</script>
</head>
<body>
    <div class="top">
        <div class="header">
            <h1><span class="white">Cowitch-19 datamancy</span></h1>
            <h3><span class="medium_white">These models are based on elaborate (wink wink) data witch-doctory using observed Covid-19 growth rate in the Czech republic and elsewhere.</span></h3>
            <span class="small_white">Czech data taken from: <a href=https://onemocneni-aktualne.mzcr.cz/covid-19>https://onemocneni-aktualne.mzcr.cz/covid-19</a>.<br/>
            <span class="small_white">Rest is from: <a href=https://github.com/CSSEGISandData/COVID-19>https://github.com/CSSEGISandData/COVID-19</a>.<br/><br/>
            Last change: <?php echo date("d/m/y H:i", $max_code); ?> (code), <?php echo date("d/m/y H:i", $max_data); ?> (data)</span>
        </div>
    </div>
    <div class="graph_container">
        <a id="cz_pred_13-02"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="infected_cz_13-02" class="graph"></canvas>
            <a class="link" href="#cz_pred_13-02">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_growth"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="growth_rate_cz" class="graph"></canvas>
            <a class="link" href="#cz_growth">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_vacc_det"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="vaccinated_cz_det" class="graph_dark"></canvas>
            <a class="link" href="#cz_vacc_det">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_vacc_det_daily"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="vaccinated_cz_det_daily" class="graph_dark"></canvas>
            <a class="link" href="#cz_vacc_det_daily">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_vacc_types_det"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="vaccinated_cz_types_det" class="graph_dark"></canvas>
            <a class="link" href="#cz_vacc_types_det">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_vacc_types_det_daily"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="vaccinated_cz_types_det_daily" class="graph_dark"></canvas>
            <a class="link" href="#cz_vacc_types_det_daily">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_vacc"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="vaccinated_cz" class="graph_dark"></canvas>
            <a class="link" href="#cz_vacc">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="sk_new"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="infected_sk" class="graph"></canvas>
            <a class="link" href="#sk_new">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="sk_growth"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="growth_rate_sk" class="graph"></canvas>
            <a class="link" href="#sk_growth">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_sick"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_sick" class="graph"></canvas>
            <a class="link" href="#compare_100_sick">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_confirmed"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_confirmed" class="graph"></canvas>
            <a class="link" href="#compare_100_confirmed">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_confirmed_perc"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_confirmed_perc" class="graph"></canvas>
            <a class="link" href="#compare_100_confirmed_perc">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_deaths"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_deaths" class="graph_dark"></canvas>
            <a class="link" href="#compare_100_deaths">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_deaths_perc"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_deaths_perc" class="graph_dark"></canvas>
            <a class="link" href="#compare_100_deaths_perc">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_deaths_daily"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_deaths_daily" class="graph_dark"></canvas>
            <a class="link" href="#compare_100_deaths_daily">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_100_deaths_daily_avg_7"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100_deaths_daily_avg_7" class="graph_dark"></canvas>
            <a class="link" href="#compare_100_deaths_daily_avg_7">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_pred_05-01"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="infected_cz_05-01" class="graph"></canvas>
            <a class="link" href="#cz_pred_05-01">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_pred_27-12"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="infected_cz_27-12" class="graph"></canvas>
            <a class="link" href="#cz_pred_27-12">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_pred_31-10"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
    		<canvas id="infected_cz_31-10" class="graph"></canvas>
            <a class="link" href="#cz_pred_31-10">link</a>
    	</div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_pred_20-09"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="infected_cz" class="graph"></canvas>
            <a class="link" href="#cz_pred_20-09">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="bottom_container">
        <div class="bottom_nav">
            Do you want to know your future ? Ask at fortune 💔 witch19.space
		</div>
    </div>
</body>

<script>
    // detect if mobile or desktop
    detect_client();
</script>
<!-- GRAPH CZ 02.13 -->
<script src="graph_cz_13-02.js?v=<?php echo filemtime('graph_cz_13-02.js'); ?>"></script>

<!-- GRAPH CZ Growth Rate-->
<script src="graph_cz_growth.js?v=<?php echo filemtime('graph_cz_growth.js'); ?>"></script>

<!-- GRAPH CZ Vaccinations - Detailed -->
<script src="graph_cz_vaccinated_details.js?v=<?php echo filemtime('graph_cz_vaccinated_details.js'); ?>"></script>

<!-- GRAPH CZ Vaccinations - Detailed & Daily -->
<script src="graph_cz_vaccinated_daily_details.js?v=<?php echo filemtime('graph_cz_vaccinated_daily_details.js'); ?>"></script>

<!-- GRAPH CZ Vaccinations by Types - Detailed -->
<script src="graph_cz_vaccinated_types_details.js?v=<?php echo filemtime('graph_cz_vaccinated_types_details.js'); ?>"></script>

<!-- GRAPH CZ Vaccinations by Types - Detailed & Daily-->
<script src="graph_cz_vaccinated_types_daily_details.js?v=<?php echo filemtime('graph_cz_vaccinated_types_daily_details.js'); ?>"></script>

<!-- GRAPH CZ Vaccinations-->
<script src="graph_cz_vaccinated.js?v=<?php echo filemtime('graph_cz_vaccinated.js'); ?>"></script>

<!-- GRAPH SK -->
<script src="graph_sk_new.js?v=<?php echo filemtime('graph_sk_new.js'); ?>"></script>

<!-- GRAPH SK Growth Rate-->
<script src="graph_sk_growth.js?v=<?php echo filemtime('graph_sk_growth.js'); ?>"></script>

<!-- GRAPH Compare Sick per 100k -->
<script src="graph_compare_sick_eu.js?v=<?php echo filemtime('graph_compare_sick_eu.js'); ?>"></script>

<!-- GRAPH Compare Confirmed per 100k -->
<script src="graph_compare_confirmed_eu.js?v=<?php echo filemtime('graph_compare_confirmed_eu.js'); ?>"></script>

<!-- GRAPH Compare Confirmed as percentage of population -->
<script src="graph_compare_confirmed_perc_eu.js?v=<?php echo filemtime('graph_compare_confirmed_perc_eu.js'); ?>"></script>

<!-- GRAPH Compare Deaths per 100k -->
<script src="graph_compare_deaths_eu.js?v=<?php echo filemtime('graph_compare_deaths_eu.js'); ?>"></script>

<!-- GRAPH Compare Deaths as percentage of population -->
<script src="graph_compare_deaths_perc_eu.js?v=<?php echo filemtime('graph_compare_deaths_perc_eu.js'); ?>"></script>

<!-- GRAPH Compare Deaths daily per 100k -->
<script src="graph_compare_deaths_daily_eu.js?v=<?php echo filemtime('graph_compare_deaths_daily_eu.js'); ?>"></script>

<!-- GRAPH Compare Deaths daily per 100k rolling 7-day average -->
<script src="graph_compare_deaths_daily_eu_avg_7.js?v=<?php echo filemtime('graph_compare_deaths_daily_eu_avg_7.js'); ?>"></script>

<!-- GRAPH CZ 01.05 -->
<script src="graph_cz_05-01.js?v=<?php echo filemtime('graph_cz_05-01.js'); ?>"></script>

<!-- GRAPH CZ 27.12 -->
<script src="graph_cz_27-12.js?v=<?php echo filemtime('graph_cz_27-12.js'); ?>"></script>

<!-- GRAPH CZ 31.10 -->
<script src="graph_cz_31-10.js?v=<?php echo filemtime('graph_cz_31-10.js'); ?>"></script>

<!-- GRAPH CZ OLD -->
<script src="graph_cz_20-09.js?v=<?php echo filemtime('graph_cz_20-09.js'); ?>"></script>


</html>
