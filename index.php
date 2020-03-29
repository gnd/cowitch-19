<html>
<head>
<title>
    cowitch-19 - epidemiological witch-doctory
</title>

<!-- META -->
<meta charset="UTF-8">
<meta name="description" content="Epidemiological witch-doctory / datamancy / Covid-19 fortune telling" />
<meta name="keywords" content="covid-19 czechia czech republic quarantine pandemy epidemy corona coronavirus graph model" />
<meta name="revisit-after" content="1 days" />
<meta name="viewport" content="width=device-width,initial-scale=1" />

<!-- OPEN GRAPH -->
<meta property="og:locale" content="en_EN" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Cowitch-19" />
<meta property="og:description" content="Epidemiological witch doctory / datamancy / Covid-19 fortune telling" />
<meta property="og:url" content="co.witch19.space" />
<meta property="og:image" content="https://co.witch19.space/corona-chan-black.jpg" />
<meta property="og:image:secure_url" content="https://co.witch19.space/corona-chan-black.jpg" />

<!--TODO:
- use SIER to predict longterm
    - add population size, immune pool, dead pool, etc
- add tables to graphs
- add descriptions to graphs
- add interface to change params from web
- how to correctly estimate slow-down rate ?
- add a way to access older states (eg. state from 22.3, etc)
- implement a graph estimating real infected numbers https://www.scmp.com/news/china/society/article/3076323/third-coronavirus-cases-may-be-silent-carriers-classified
    - use also https://www.cssz.cz/web/cz/nemocenska-statistika#section_5
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
<script src="data/confirmed.js"></script>
<script src="data/recovered.js"></script>
<script src="data/deaths.js"></script>

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
    moment.suppressDeprecationWarnings = true;

    // Create the data arrays using values
    data = {};
    current_values = {};
    days_elapsed = {};
    seed = {'rate': {}, 'rate7': {}, 'new': {}};

    // Get Czech data from https://onemocneni-aktualne.mzcr.cz/covid-19
    current_values['cz'] = [3,3,5,5,8,19,26,32,38,63,94,116,141,189,298,383,464,572,774,904,1047,1165,1289,1497,1775,2062,2422,2689];
    current_values['cz_recovered'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,6,9,9,9,11];
    current_values['cz_deaths'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,6,9,9,11,16]

    // Get rest of the data from https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
    extract_data(global_data, current_values, 'Korea South', 'kr');
    extract_data(global_data, current_values, 'Japan', 'jp');
    extract_data(global_data, current_values, 'Singapore', 'sg');
    extract_data(global_data, current_values, 'Italy', 'it');

    // Fill initial stats for countries
    days_elapsed['cz'] = fill_initial(data, current_values, 'cz');
    days_elapsed['jp'] = fill_initial(data, current_values, 'jp');
    days_elapsed['kr'] = fill_initial(data, current_values, 'kr');
    days_elapsed['sg'] = fill_initial(data, current_values, 'sg');
    days_elapsed['it'] = fill_initial(data, current_values, 'it');

    // Create growth_rate seed and new cases seed for modelling
    create_seeds(seed, days_elapsed, 'cz');
    create_seeds(seed, days_elapsed, 'kr');

    // prepare values for compare_100
    prepare_100(current_values, 'cz');
    prepare_100(current_values, 'jp');
    prepare_100(current_values, 'kr');
    prepare_100(current_values, 'sg');
    prepare_100(current_values, 'it');

    // prepare values for compare_growth_rates
    fill_initial(data, current_values, 'cz_100');
    fill_initial(data, current_values, 'jp_100');
    fill_initial(data, current_values, 'kr_100');
    fill_initial(data, current_values, 'sg_100');
    fill_initial(data, current_values, 'it_100');

    // Prepare the model
    model = {};
    MAXDAYS = 90;
    JITTER_COUNT = 50;
    JITTER_AMOUNT = 0.015;

    // Put together the models parameters
    var model1 = new params(
        'cz_a',
        150,
        seed['rate']['cz'],
        'log',
        120,                    // rate of slowdown, smaller is faster
        1.02,                   // min possible growth rate
        seed['new']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,          // jitter amount
        'healthy_new',
        'dead_new',
    );

    // Add another scenario
    var model2 = new params(
        'cz_b',
        150,
        seed['rate']['cz'],
        'log',
        70,                     // rate of slowdown, smaller is faster
        1.027,                  // min possible growth rate
        seed['new']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,          // jitter amount
        'healthy_new',
        'dead_new',
    );

    // Put together the models parameters
    var model3 = new params(
        'cz_c',
        150,
        seed['rate7']['cz'],
        'log',
        120,                    // rate of slowdown, smaller is faster
        1.02,                   // min possible growth rate
        seed['new']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT/2,          // jitter amount
        'healthy_new',
        'dead_new',
    );

    // Run the model for infected_cz and growth_rate_cz
    run_model( model1 );
    run_model( model2 );
    run_model( model3 );

    // Add Korea as a model
    var model_kr = new params(
        'model_kr',
        MAXDAYS,
        seed['rate']['kr'],
        'log',
        55,                        // rate of slowdown, smaller is faster
        1.027,                      // min possible growth rate
        seed['new']['kr'],     // the confirmed cases so far
        1,                          // jitter count
        JITTER_AMOUNT,              // jitter amount
        'healthy_new',
        'dead_new',
    );

    // Run the model for korea
    run_model( model_kr );

    // compute growth rate for kr_confirmed & use the data in the compare_growth chart
    fill_initial(data, current_values, 'kr_confirmed');

    // Once more model korea
    rateslice = {};
    newslice = {};
    for (i=0; i<38; i++) {
        rateslice[i] = seed['rate']['kr'][i];
        newslice[i] = seed['new']['kr'][i];
    }
    var model_kr2 = new params(
        'model_kr2',
        150,
        rateslice,
        'log',
        30,                    // rate of slowdown, smaller is faster
        1.027,                  // min possible growth rate
        newslice,               // the confirmed cases so far
        JITTER_COUNT,                      // jitter count
        JITTER_AMOUNT/2,          // jitter amount
        'healthy_new',
        'dead_new',
    );
    // Run the model for korea
    run_model( model_kr2 );

    // try predict from day 50
    rateslice = {};
    newslice = {};
    for (i=0; i<60; i++) {
        rateslice[i] = seed['rate']['kr'][i];
        newslice[i] = seed['new']['kr'][i];
    }
    var model_kr2a = new params(
        'model_kr2a',
        150,
        rateslice,
        'log',
        55,                    // rate of slowdown, smaller is faster
        1.027,                  // min possible growth rate
        newslice,               // the confirmed cases so far
        JITTER_COUNT,                      // jitter count
        JITTER_AMOUNT*4,          // jitter amount
        'healthy_new',
        'dead_new',
    );

    // Run the model for korea
    run_model( model_kr2a );
    //console.log(model['model_kr2']);

</script>
</head>
<body>
    <div class="top">
        <div class="header">
            <h1><span class="white">Cowitch-19 datamancy</span></h1>
            <h3><span class="white">This model is based on an elaborate data witch-doctory using observed Covid-19 growth rate in Czech republic.</span></h3>
            <span class="small_white">Initial data taken from: <a href=https://onemocneni-aktualne.mzcr.cz/covid-19>https://onemocneni-aktualne.mzcr.cz/covid-19</a>.<br/>
            Last change: <?php echo date("d/m/y H:i", $max); ?></span>
        </div>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
    		<canvas id="infected_cz" class="graph"></canvas>
    	</div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="growth_rate_cz" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="compare" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="compare_100" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="compare_growth_rates" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="korea_test" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="korea_pred" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="bottom_container">
        <div class="bottom_nav">
            contact: data 💔 witch19.space
		</div>
    </div>
</body>

<script>
    // detect if mobile or desktop
    detect_client();
</script>
<!-- GRAPH CZ -->
<script src="graph_cz.js?v=<?php echo filemtime($cwd . 'graph_cz.js'); ?>"></script>

<!-- GRAPH compare (CZ / JP / KR / SG)  & compare_100-->
<script src="graph_compare.js?v=<?php echo filemtime($cwd . 'graph_compare.js'); ?>"></script>

<!-- kr -->
<script src="korea_test.js?v=<?php echo filemtime($cwd . 'korea_test.js'); ?>"></script>

</html>
