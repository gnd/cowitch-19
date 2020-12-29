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
<script src="data/confirmed_cz.js?v=<?php echo filemtime($cwd . 'data/confirmed_cz.js'); ?>"></script>
<script src="data/recovered_cz.js?v=<?php echo filemtime($cwd . 'data/recovered_cz.js'); ?>"></script>
<script src="data/deaths_cz.js?v=<?php echo filemtime($cwd . 'data/deaths_cz.js'); ?>"></script>
<script src="data/tests_cz.js?v=<?php echo filemtime($cwd . 'data/tests_cz.js'); ?>"></script>

<?php
    // compute last change to the model(s)
    $max_code = filemtime($cwd . 'index.php');
    $max_code = max($max_code, filemtime($cwd . 'graph.js'));
    $max_code = max($max_code, filemtime($cwd . 'model.js'));
    // compute last change to the data
    $max_data = filemtime($cwd . 'data/deaths.js');
    $max_data = max($max_data, filemtime($cwd . 'data/deaths_cz.js'));
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

    population_size['cz'] = 10693939; //https://en.wikipedia.org/wiki/Demographics_of_the_Czech_Republic

    // Get Czech data from https://onemocneni-aktualne.mzcr.cz/covid-19
    extract_data_cz(czech_data, current_values, 'cz');

    // Fill initial stats for countries
    days_elapsed['cz'] = fill_initial(data, current_values, 'cz');

    // Prepare the model
    model = {};
    JITTER_COUNT = 50;
    JITTER_AMOUNT = 0.015;

    // What do we even model here ? Right, young padawan, nothing. This model has no claim to reality
    // The data we try to aproximate are imprecise, incomplete measurements, obtained with a dubious methodology and abysmal success rates.
    // Modelling Covid-19 is like trying to glimpse reality through a broken and distorted plastic mirror taken out from a trash heap..

    // Create growth_rate seed and new cases seed for modelling
    create_seeds(seed, days_elapsed, 'cz');

    // This is a model following the 7-day rolling average of growth rate in Czech republic
    // TODO define a suite of realistic rate functions for autumn
    rate_funcs = [];
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
        population_size['cz'],
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
        population_size['cz'],
    );
    run_model( model_settings_31_10 );
    
    
    // 27.12.2020
    // This is a model following the 7-day rolling average of growth rate in Czech republic
    rate_funcs = [];
    var PREDICTION_DAY = 302; // Day 301 is 27.12.2020
    // rationale is duplicate the decline of the rate after the peak following the second lockdown
    rate_funcs.push( new rate_func(
        'exp',                      // name
        PREDICTION_DAY,             // start
        150,                        // steps
        0.5,                        // speed / steepness
        -0.3,                        // scale
    ));
    rate_funcs.push( new rate_func(
        'sig',                      // name
        PREDICTION_DAY+10,             // start
        200,                        // steps
        .9,                        // speed / steepness
        0.1,                        // scale
    ));
    // here we use only first N days to be able to freeze predictions in time
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
        population_size['cz'],
    );
    run_model( model_settings_27_12 );

</script>
</head>
<body>
    <div class="top">
        <div class="header">
            <h1><span class="white">Cowitch-19 datamancy</span></h1>
            <h3><span class="medium_white">These models are based on elaborate (wink wink) data witch-doctory using observed Covid-19 growth rate in Czech republic and elsewhere.</span></h3>
            <span class="small_white">Czech data taken from: <a href=https://onemocneni-aktualne.mzcr.cz/covid-19>https://onemocneni-aktualne.mzcr.cz/covid-19</a>.<br/>
            <span class="small_white">Rest is from: <a href=https://github.com/CSSEGISandData/COVID-19>https://github.com/CSSEGISandData/COVID-19</a>.<br/><br/>
            Last change: <?php echo date("d/m/y H:i", $max_code); ?> (code), <?php echo date("d/m/y H:i", $max_data); ?> (data)</span>
        </div>
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
        <a id="cz_pred_27-12"></a>
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="infected_cz_27-12" class="graph"></canvas>
            <a class="link" href="#cz_pred_27-12">link</a>
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
<script src="graph_cz_new.js?v=<?php echo filemtime($cwd . 'graph_cz_new.js'); ?>"></script>

<!-- GRAPH CZ FUTURE -->
<script src="graph_cz_31-10.js?v=<?php echo filemtime($cwd . 'graph_cz_31-10.js'); ?>"></script>

<!-- GRAPH CZ FUTURE -->
<script src="graph_cz_27-12.js?v=<?php echo filemtime($cwd . 'graph_cz_27-12.js'); ?>"></script>

</html>
