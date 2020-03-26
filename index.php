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
- modify model to incorporate lessons from KR
- add descriptions to graphs
- use SIER to predict longterm
    - add population size, immune pool, dead pool, etc
- add healed / dead / new per day
- add tables to graphs
- add interface to change params from web
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

<?php
    // compute last change to the model(s)
    $max = filemtime($cwd . 'index.php');
    $max = max($max, filemtime($cwd . 'graph.js'));
    $max = max($max, filemtime($cwd . 'model.js'));
?>

<!-- SEED AND PREPARE THE MODEL -->
<script>
    aspect_ratio = 2; // Desktop graph aspect ratio
    aspect_ratio_mobile = 1.15; // Mobile graph aspect ratio

    // Create the data array using values
    // cz - from https://onemocneni-aktualne.mzcr.cz/covid-19
    // jp, kr - from https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
    data = {};
    current_values = {};
    days_elapsed = {};
    seed = {'rate': {}, 'new': {}};
    current_values['cz'] = [3,3,5,5,8,19,26,32,38,63,94,116,141,189,298,383,464,572,774,904,1047,1165,1289,1497,1775];
    current_values['jp'] = [2,2,2,2,4,4,7,7,11,15,20,20,20,22,22,22,25,25,26,26,26,28,28,29,43,59,66,74,84,94,105,122,147,159,170,189,214,228,241,256,274,293,331,360,420,461,502,511,581,639,639,701,773,839,839,878,889,924,963,1007,1101,1128,1193,1307];
    current_values['kr'] = [1,1,2,2,3,4,4,4,4,11,12,15,15,16,19,23,24,24,25,27,28,28,28,28,28,29,30,31,31,104,204,433,602,833,977,1261,1766,2337,3150,3736,4335,5186,5621,6088,6593,7041,7314,7478,7513,7755,7869,7979,8086,8162,8236,8320,8413,8565,8652,8799,8961,8961,9037,9137];
    current_values['sg'] = [1,3,3,4,5,7,7,10,13,16,18,18,24,28,28,30,33,40,45,47,50,58,67,72,75,77,81,84,84,85,85,89,89,91,93,93,93,102,106,108,110,110,117,130,138,150,150,160,178,178,200,212,226,243,266,313,345,385,432,455,509,558,631];
    current_values['it'] = [2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,20,62,155,229,322,453,655,888,1128,1694,2036,2502,3089,3858,4636,5883,7375,9172,10149,12462,12462,17660,21157,24747,27980,31506,35713,41035,47021,53578,59138,63927,69176,74386];
    days_elapsed['cz'] = fill_initial(data, current_values, 'cz');
    days_elapsed['jp'] = fill_initial(data, current_values, 'jp');
    days_elapsed['kr'] = fill_initial(data, current_values, 'kr');
    days_elapsed['sg'] = fill_initial(data, current_values, 'sg');
    days_elapsed['it'] = fill_initial(data, current_values, 'it');

    // Prepare the model
    model = {};
    MAXDAYS = 90;
    JITTER_COUNT = 50;
    JITTER_AMOUNT = 0.015;

    // Create growth_rate seed  and new cases seed for the cz model
    create_seeds(seed, days_elapsed, 'cz');

    // Put together the models parameters
    var model1 = new params(
        'projection',
        MAXDAYS,
        seed['rate']['cz'],
        'log',
        120,                    // rate of slowdown, smaller is faster
        1.01,                   // min possible growth rate
        seed['new']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT,          // jitter amount
    );

    // Add another scenario
    var model2 = new params(
        'projection-optimistic',
        MAXDAYS,
        seed['rate']['cz'],
        'log',
        50,                     // rate of slowdown, smaller is faster
        1.001,                  // min possible growth rate
        seed['new']['cz'],      // the confirmed cases so far
        JITTER_COUNT,           // jitter count
        JITTER_AMOUNT,          // jitter amount
    );

    // Run the model for infected_cz and growth_rate_cz
    run_model( model1 );
    run_model( model2 );

    // prepare values for compare_100
    prepare_100(current_values, 'cz');
    prepare_100(current_values, 'jp');
    prepare_100(current_values, 'kr');
    prepare_100(current_values, 'sg');
    prepare_100(current_values, 'it');

    // Create growth_rate seed  and new cases seed for the comparative graph
    create_seeds(seed, days_elapsed, 'jp');
    create_seeds(seed, days_elapsed, 'kr');
    create_seeds(seed, days_elapsed, 'sg');

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
    <div class="bottom_container">
        <div class="bottom_nav">
            Future controls here.
		</div>
    </div>
</body>

<!-- FUNCTIONS -->
<script src="functions.js?v=<?php echo filemtime($cwd . 'functions.js'); ?>"></script>

<!-- GRAPH CZ -->
<script src="graph_cz.js?v=<?php echo filemtime($cwd . 'graph_cz.js'); ?>"></script>

<!-- GRAPH compare (CZ / JP / KR / SG)  & compare_100-->
<script src="graph_compare.js?v=<?php echo filemtime($cwd . 'graph_compare.js'); ?>"></script>

</html>
