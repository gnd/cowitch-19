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
        300,                        // model duration
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
    //run_model( cz_future_1 );


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
    //run_model( cz_future_2 );
    //console.log( model['cz_future_2'] );

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
<script src="graph_cz_future_new.js?v=<?php echo filemtime($cwd . 'graph_cz_future_new.js'); ?>"></script>

<!-- GRAPH CZ FUTURE -->
<script src="graph_cz_future_2_new.js?v=<?php echo filemtime($cwd . 'graph_cz_future_2_new.js'); ?>"></script>

</html>
