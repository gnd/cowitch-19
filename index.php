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

<!--TODO:
- model the long future, use ~70% as immunity threshold (Kwok, 2020) DOI: 10.1016/j.jinf.2020.03.027
- freeze all scenarios in time
- problem with cron and new data for sk, solve
- add descriptions to graphs
- add tables to graphs
- add some kind of probabilistic infection to SIER (the less people are susceptible, the harder it is to infect someone)
- add interface to change params from web
- how to correctly estimate slow-down rate ?
-->

<!-- MOMENT.JS -->
<script src="moment.js"></script>

<!-- CHART.JS & PLUGINS-->
<script src="Chart.min.js"></script>
<script src="chartjs-plugin-annotation.min.js"></script>

<!-- PALETTE.JS -->
<script src="palette.js"></script>

<!-- FUNCTIONS -->
<script src="functions.js?v=<?php echo filemtime($cwd . 'functions.js'); ?>"></script>

<!-- MOBILE & DESKTOP STYLES -->
<link rel="stylesheet" media='screen and (min-width: 300px) and (max-width: 340px)' href="mobile.css?v=<?php echo filemtime($cwd . 'mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 341px) and (max-width: 365px)' href="mobile.css?v=<?php echo filemtime($cwd . 'mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 370px) and (max-width: 380px)' href="mobile.css?v=<?php echo filemtime($cwd . 'mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 400px) and (max-width: 1000px)' href="mobile.css?v=<?php echo filemtime($cwd . 'mobile.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 1001px) and (max-width: 1300px)' href="desktop.css?v=<?php echo filemtime($cwd . 'desktop.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 1301px) and (max-width: 1599px)' href="desktop.css?v=<?php echo filemtime($cwd . 'desktop.css'); ?>"/>
<link rel="stylesheet" media='screen and (min-width: 1600px)' href="desktop.css?v=<?php echo filemtime($cwd . 'desktop.css'); ?>"/>

<!-- MODEL -->
<script src="model.js?v=<?php echo filemtime($cwd . 'model.js'); ?>"></script>

<!-- DATA -->
<script src="data/confirmed.js?v=<?php echo filemtime($cwd . 'data/confirmed.js'); ?>"></script>
<script src="data/recovered.js?v=<?php echo filemtime($cwd . 'data/recovered.js'); ?>"></script>
<script src="data/deaths.js?v=<?php echo filemtime($cwd . 'data/deaths.js'); ?>"></script>

<?php
    // compute last change to the model(s)
    $max = filemtime($cwd . 'index.php');
    $max = max($max, filemtime($cwd . 'graph.js'));
    $max = max($max, filemtime($cwd . 'model.js'));
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

    // Get Czech data from https://onemocneni-aktualne.mzcr.cz/covid-19
    current_values['cz_confirmed'] = [3,3,5,5,8,19,26,32,38,63,94,116,141,189,298,383,464,572,774,904,1047,1165,1289,1497,1775,2062,2422,2689,2859,3002,3330,3604,3869,4194,4475,4591,4828,5033,5335,5589,5735,5905,5991,6059,6151,6303,6437,6553,6657,6787,6914,7041,7136,7188,7273,7352,7404,7486,7563,7581,7689,7750,7755,7781,7841,7899,7979,8077,8089,8095];
    current_values['cz_recovered'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,6,9,9,9,11,11,25,45,61,71,74,78,96,127,181,243,309,370,422,467,527,676,831,979,1183,1235,1311,1597,1753,2002,2186,2389,2471,2555,2942,3096,3120,3314,3446,3471,3592,3816,4017,4214,4446,4446,4448];
    current_values['cz_deaths'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,6,9,9,11,16,17,24,32,40,46,56,62,72,80,91,104,113,123,132,139,147,163,166,170,176,181,188,196,201,210,213,215,219,221,225,227,227,231,245,245,249,252,258,263,274,276,276];
    current_values['cz'] = [];
    for (var i=0; i<current_values['cz_confirmed'].length; i++) {
        current_values['cz'].push( current_values['cz_confirmed'][i] - current_values['cz_recovered'][i] - current_values['cz_deaths'][i] );
    }
    population_size['cz'] = 10693939; //https://en.wikipedia.org/wiki/Demographics_of_the_Czech_Republic

    // Get rest of the data from https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
    // The data are not exactly precise, when verifying against data like
    // Japan: https://covid19japan.com/
    // Singapore: https://experience.arcgis.com/experience/7e30edc490a5441a874f9efe67bd8b89
    // Italy: http://www.salute.gov.it/nuovocoronavirus
    // The difference is usually around 1-2% which is ok given what kind of data we work with..
    extract_data(global_data, current_values, 'Czechia', 'cz_global');
    extract_data(global_data, current_values, 'Korea South', 'kr');
    extract_data(global_data, current_values, 'Japan', 'jp');
    extract_data(global_data, current_values, 'Singapore', 'sg');
    extract_data(global_data, current_values, 'Italy', 'it');
    extract_data(global_data, current_values, 'Slovakia', 'sk');
    extract_data(global_data, current_values, 'Greece', 'gr');
    extract_data(global_data, current_values, 'Hungary', 'hu');
    // Fill initial stats for countries
    days_elapsed['cz'] = fill_initial(data, current_values, 'cz');
    days_elapsed['jp'] = fill_initial(data, current_values, 'jp');
    days_elapsed['kr'] = fill_initial(data, current_values, 'kr');
    days_elapsed['sg'] = fill_initial(data, current_values, 'sg');
    days_elapsed['it'] = fill_initial(data, current_values, 'it');
    days_elapsed['sk'] = fill_initial(data, current_values, 'sk', 39); // We start from 1st of March, not from 22nd of January
    days_elapsed['gr'] = fill_initial(data, current_values, 'gr');
    days_elapsed['gr'] = fill_initial(data, current_values, 'hu');

    // prepare values for compare_100
    prepare_100(current_values, 'cz');
    prepare_100(current_values, 'jp');
    prepare_100(current_values, 'kr');
    prepare_100(current_values, 'sg');
    prepare_100(current_values, 'it');
    prepare_100(current_values, 'sk');
    prepare_100(current_values, 'gr');
    prepare_100(current_values, 'hu');

    // prepare values for compare_1
    prepare_1(current_values, 'cz');
    prepare_1(current_values, 'jp');
    prepare_1(current_values, 'kr');
    prepare_1(current_values, 'sg');
    prepare_1(current_values, 'it');
    prepare_1(current_values, 'sk');
    prepare_1(current_values, 'gr');
    prepare_1(current_values, 'hu');

    // prepare values for compare_growth_rates
    fill_initial(data, current_values, 'cz_100');
    fill_initial(data, current_values, 'jp_100');
    fill_initial(data, current_values, 'kr_100');
    fill_initial(data, current_values, 'sg_100');
    fill_initial(data, current_values, 'it_100');
    fill_initial(data, current_values, 'sk_100');
    fill_initial(data, current_values, 'gr_100');
    fill_initial(data, current_values, 'hu_100');


    // prepare values for compare_growth_rates
    fill_initial(data, current_values, 'cz_1');
    fill_initial(data, current_values, 'jp_1');
    fill_initial(data, current_values, 'kr_1');
    fill_initial(data, current_values, 'sg_1');
    fill_initial(data, current_values, 'it_1');
    fill_initial(data, current_values, 'sk_1');
    fill_initial(data, current_values, 'gr_1');
    fill_initial(data, current_values, 'hu_1');

    // Prepare the model
    model = {};
    JITTER_COUNT = 50;
    JITTER_AMOUNT = 0.015;

    // What do we even model here ? Right, young padawan, nothing. This model has no claim to reality
    // The data we try to aproximate are imprecise, incomplete measurements, obtained with a dubious methodology and abysmal success rates.
    // Modelling Covid-19 is like trying to glimplse reality through a broken and distorted plastic mirror taken out from a trash heap..

    // Create growth_rate seed and new cases seed for modelling
    create_seeds(seed, days_elapsed, 'cz');

    /* no need for this now - 17.04.2020
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        123,                        // steps
        250,                        // speed (rate of slowdown)
        -1,                          // scale
    ));
    var model1 = new params(
        'cz_a',
        123,
        seed['growth_rate']['cz'],
        1.01,                   // min possible growth rate
        seed['infected']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT,          // jitter amount
        'recovered_new',            // recovered distribution
        40,                     //recovered offset
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        population_size['cz'],
    );
    run_model( model1 );
    */

    /* no need for this anymore - 14.04.2020
    // This is the so-called optimistic model, where we set the rate of slowdown to be pretty fast
    // This could be a representation of the strictest quarantine behavior which is not gonna happen
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        123,                        // steps
        100,                        // speed (rate of slowdown)
        -1,                          // scale
    ));
    var model2 = new params(
        'cz_b',
        123,
        seed['growth_rate']['cz'],
        1.01,                   // min possible growth rate
        seed['infected']['cz'],       // the confirmed cases so far
        JITTER_COUNT,            // jitter count
        JITTER_AMOUNT/2,         // jitter amount
        'recovered_new',            // recovered distribution
        40,
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        population_size['cz'],
    );
    run_model( model2 );
    */

    // This is a model following the 7-day rolling average of growth rate in Czech republic
    // The rate of slowdown was chosen so as to hit 1 around 22 days from 30.03 - to resemble the historic Korean 7day average
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        123,                        // steps
        400,                        // speed (rate of slowdown)
        -1,                          // scale
    ));
    var model3 = new params(
        'cz_c',
        123,
        seed['growth_rate_avg_7']['cz'],
        1.01,                       // min possible growth rate
        seed['infected']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',            // recovered distribution
        40,
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        population_size['cz'],
    );
    run_model( model3 );


    // cz_future_1 model
    // Scenario:
    // Czech government decides to lift quarantine after Easter Monday 13.4
    // People already start celebrating on Friday 10.4 after the peak of the epidemy was announced
    // During the whole week infection rates slowly grow
    //
    // We take as a basis the cz_a model from above, seed some additional values
    // and reduce jitter fourfold (too much noise)
    day = 42+5;     // it shows a week later
    seed_tmp = [];
    for (i=0; i<42; i++) {
        seed_tmp.push( seed['growth_rate']['cz'][i] );
    }
    seed_tmp[day] = 1.03;
    seed_tmp[day+1] = 1.04;
    seed_tmp[day+2] = 1.05;
    seed_tmp[day+3] = 1.06;
    seed_tmp[day+4] = 1.07;
    seed_tmp[day+5] = 1.08;
    seed_tmp[day+6] = 1.09;
    seed_tmp[day+7] = 1.10;
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        123,                        // steps
        250,                        // speed (rate of slowdown)
        -1,                         // scale
    ));
    var cz_future_1 = new params(
        'cz_future_1',
        123,
        seed_tmp,
        1.02,                       // min possible growth rate
        seed['infected']['cz'],     // the confirmed cases so far
        JITTER_COUNT,               // jitter count
        JITTER_AMOUNT/4,            // jitter amount
        'recovered_new',            // recovered distribution
        40,
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR)
        rate_funcs,
        population_size['cz'],
    );
    run_model( cz_future_1 );


    // cz_future_2 model
    // Scenario:
    // Long-term modelling of Covid-19 in Czech republic
    var cz_future_2_seed = {};
    var reported_ratio = 1.75;
    for (i=0; i<days_elapsed['cz']; i++) {
        cz_future_2_seed[i] = seed['infected']['cz'][i] * reported_ratio;
    }
    //cz_future_2_seed[190] = 1; // Single sick person enters CZ on Sept 6th
    rate_funcs = [];
    // make the thing die out end of June
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        300,                       // steps - just high enough here to last the whole time
        500,                        // speed - formerly rate of slowdown
        -1,                         // scale
    ));
    rate_funcs.push( new rate_func(
        'exp',                  // name
        71,                          // start
        192,                       // steps
        6.5,                        // speed - formerly rate of slowdown
        0.4,                          // scale
    ));
    rate_funcs.push( new rate_func(
        'log',                  // name
        263,                     // start
        40,                       // steps
        1,                        // speed - formerly rate of slowdown
        -0.4,                         // scale
    ));
    var cz_future_2 = new params(
        'cz_future_2',
        500,
        seed['growth_rate']['cz'],
        1.01,                       // min possible growth rate
        cz_future_2_seed,           // the confirmed cases so far
        50,                         // jitter count
        JITTER_AMOUNT/20,           // jitter amount
        'recovered_new',                // recovered distribution
        40,
        'linton',                   // deaths distribution
        0.05/reported_ratio,        // infection fatality rate (current best CFR / reported_ratio)
        rate_funcs,
        population_size['cz'],
        reported_ratio,             // real-to-reported ratio.
    );
    run_model( cz_future_2 );
    //console.log( model['cz_future_2'] );

    // Model Slovak development
    var model_days_sk = 155;
    // Create growth_rate seed and new cases seed for modelling
    create_seeds(seed, days_elapsed, 'sk');
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'log',                      // name
        0,                          // start
        300,                        // steps
        800,                        // speed (rate of slowdown)
        -1.2,                       // scale
    ));
    var sk_model_1 = new params(
        'sk_avg7_normal',
        model_days_sk,
        seed['growth_rate_avg_7']['sk'],
        1.01,                       // min possible growth rate
        seed['infected']['sk'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/8,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                       // recovered offset - FIXME
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR) FIXME
        rate_funcs,
        population_size['cz'],
    );
    run_model( sk_model_1 );

    // A more sinister Slovak model, mimicking Japan
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'exp',                      // name
        47,                          // start
        20,                        // steps
        2,                        // steepness
        0.08,                          // scale
    ));
    rate_funcs.push( new rate_func(
        'log',                      // name
        66,                          // start
        90,                        // steps
        0.4,                        // steepness
        -0.13,                       // scale
    ));
    var sk_model_2 = new params(
        'sk_avg7_pesimist',
        model_days_sk,
        seed['growth_rate_avg_7']['sk'],
        1.01,                       // min possible growth rate
        seed['infected']['sk'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/8,        // jitter amount
        'recovered_new',            // recovered distribution
        40,                       // recovered offset - FIXME
        'linton',               // deaths distribution
        0.05,                      // case fatality rate (CFR) FIXME
        rate_funcs,
        population_size['cz'],
    );
    run_model( sk_model_2 );

    // Model korea
    rateslice = {};
    newslice = {};
    create_seeds(seed, days_elapsed, 'kr');
    for (i=0; i<38; i++) {
        rateslice[i] = seed['growth_rate']['kr'][i];
        newslice[i] = seed['infected']['kr'][i];
    }
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        150,                        // steps
        30,                        // speed (rate of slowdown)
        -1,                          // scale
    ));
    var model_kr2 = new params(
        'model_kr2',
        150,
        rateslice,
        1.025,                  // min possible growth rate
        newslice,               // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,        // jitter amount
        'recovered_new',
        38,
        'linton',
        0.02,
        rate_funcs,
        population_size['cz'], // FIXME - foobar
    );
    // Run the model for korea
    run_model( model_kr2 );

    // try predict from day 50
    rateslice = {};
    newslice = {};
    for (i=0; i<60; i++) {
        rateslice[i] = seed['growth_rate']['kr'][i];
        newslice[i] = seed['infected']['kr'][i];
    }
    rate_funcs = [];
    rate_funcs.push( new rate_func(
        'old_log',                  // name
        0,                          // start
        150,                        // steps
        55,                        // speed (rate of slowdown)
        -1,                          // scale
    ));
    var model_kr2a = new params(
        'model_kr2a',
        150,
        rateslice,
        1.027,                  // min possible growth rate
        newslice,               // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT*4,        // jitter amount
        'recovered_new',
        36,
        'dead_new',
        0.0135,                 // FIXME
        rate_funcs,
        population_size['cz'],  // FIXME - foobar
    );
    run_model( model_kr2a );

</script>
</head>
<body>
    <div class="top">
        <div class="header">
            <h1><span class="white">Cowitch-19 datamancy</span></h1>
            <h3><span class="medium_white">These models are based on elaborate (wink wink) data witch-doctory using observed Covid-19 growth rate in Czech republic and elsewhere.</span></h3>
            <span class="small_white">Czech data taken from: <a href=https://onemocneni-aktualne.mzcr.cz/covid-19>https://onemocneni-aktualne.mzcr.cz/covid-19</a>.<br/>
            <span class="small_white">Rest is from: <a href=https://github.com/CSSEGISandData/COVID-19>https://github.com/CSSEGISandData/COVID-19</a>.<br/><br/>
            Last change: <?php echo date("d/m/y H:i", $max); ?></span>
        </div>
    </div>
    <div class="graph_container">
        <a id="cz"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
    		<canvas id="infected_cz" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#cz">link</a>
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
        <a id="cz_future_1"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="cz_future" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#cz_future_1">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="cz_future_2"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_cz_future_long" class="graph"></canvas>
            <div class="slidecontainer">
                Zoom: <input type="range" min="1" max="10000" value="50" class="slider" id="myRange">
            </div>
            <a class="link" href="https://co.witch19.space#cz_future_2">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="sk"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="model_sk" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#sk">link</a>
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
        <a id="compare"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#compare">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare100"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_100" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#compare100">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="compare_growth"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_compare_growth_rates" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#compare_growth">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="korea_test"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_korea_test" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#korea_test">link</a>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <a id="korea_future"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="canvas_korea_pred" class="graph"></canvas>
            <a class="link" href="https://co.witch19.space#korea_future">link</a>
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

    // slider
    var slider = document.getElementById("myRange");

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        chart = window.cz_future_long;
        chart.options.scales.yAxes[1].ticks.max= slider.value*1000;
        chart.update(0);
    }
</script>
<!-- GRAPH CZ -->
<script src="graph_cz.js?v=<?php echo filemtime($cwd . 'graph_cz.js'); ?>"></script>

<!-- GRAPH CZ FUTURE -->
<script src="graph_cz_future.js?v=<?php echo filemtime($cwd . 'graph_cz_future.js'); ?>"></script>

<!-- GRAPH CZ FUTURE -->
<script src="graph_cz_future_2.js?v=<?php echo filemtime($cwd . 'graph_cz_future_2.js'); ?>"></script>

<!-- GRAPH SK -->
<script src="graph_sk.js?v=<?php echo filemtime($cwd . 'graph_sk.js'); ?>"></script>

<!-- GRAPH compare (CZ / JP / KR / SG)  & compare_100-->
<script src="graph_compare.js?v=<?php echo filemtime($cwd . 'graph_compare.js'); ?>"></script>

<!-- Korea -->
<script src="korea_test.js?v=<?php echo filemtime($cwd . 'korea_test.js'); ?>"></script>

</html>
