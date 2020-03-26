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
- add DOI to studies
- verify model against JP, SG, HK and KR
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
    // Create the data array using values from https://onemocneni-aktualne.mzcr.cz/covid-19
    data = {};
    current_values = [3,3,5,5,8,19,26,32,38,63,94,116,141,189,298,383,464,572,774,904,1047,1165,1289,1497,1775];
    days_elapsed = fill_initial(data, current_values);

    // Prepare the model
    model = {};
    MAXDAYS = 90;
    JITTER_COUNT = 50;
    JITTER_AMOUNT = 0.015;

    // Create growth_rate seed for the model
    var rate_seed = {};
    for (var i=0; i < days_elapsed; i++) {
        rate_seed[i] = data['growth_rate'][i];
    }

    // Create infected seed for the model
    var new_seed = {};
    for (var i=0; i < days_elapsed; i++) {
        new_seed[i] = data['infected_confirmed'][i];
    }

    // Put together the models parameters
    var model1 = new params(
        'projection',
        MAXDAYS,
        rate_seed,
        'log',
        120,        // rate of slowdown, smaller is faster
        1.01,       // min possible growth rate
        new_seed,   // the confirmed cases so far
        JITTER_COUNT,         // jitter count
        JITTER_AMOUNT,        // jitter amount
    );

    // Add another scenario
    var model2 = new params(
        'projection-optimistic',
        MAXDAYS,
        rate_seed,
        'log',
        50,         // rate of slowdown, smaller is faster
        1.001,       // min possible growth rate
        new_seed,   // the confirmed cases so far
        JITTER_COUNT,         // jitter count
        JITTER_AMOUNT,        // jitter amount
    );

    // Run the model
    run_model( model1 );
    run_model( model2 );
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
    		<canvas id="infected" class="graph"></canvas>
    	</div>
        <br class="clear"/>
    </div>
    <div class="graph_container">
        <div class="graph_filler">&nbsp;</div>
        <div class="canvas_container">
            <canvas id="growth_rate" class="graph"></canvas>
        </div>
        <br class="clear"/>
    </div>
    <div class="bottom_container">
        <div class="bottom_nav">
            Future controls here.
		</div>
    </div>
</body>
<!-- GRAPH -->
<script src="graph.js?v=<?php echo filemtime($cwd . 'graph.js'); ?>"></script>
</html>
