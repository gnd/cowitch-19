<html>
<head>
<title>
    cowitch-19 - epidemiological witch-doctory
</title>

<!--TODO:
- add rolling average for growth rate
- look into dead / healthy - cumulative or not ?
- add healed / dead / new per day
- add tables to graphs
- add interface to change params from web
- use the SIER methodology to predict longterm
- population size, immune pool, dead pool, etc
- add a way to access older states (eg. state from 22.3, etc)
-->

<!-- MOMENT.JS -->
<script src="moment.js"></script>

<!-- CHART.JS -->
<script src="Chart.min.js"></script>

<!-- PALETTE.JS -->
<script src="palette.js"></script>

<!-- MODEL -->
<script src="model.js?v=<?php echo filemtime($cwd . 'model.js'); ?>"></script>

<!-- SEED AND PREPARE THE MODEL -->
<script>
    // Create the data array using values from https://onemocneni-aktualne.mzcr.cz/covid-19
    data = {};
    current_values = [3,3,5,5,8,19,26,32,38,63,94,116,141,189,298,383,464,572,774,904,1047,1165,1289,1497];
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

<!-- MOBILE & DESKTOP STYLES -->
<link rel="stylesheet" media='screen' href="style.css"/>

<?php
    // compute last change to the model(s)
    $max = filemtime($cwd . 'index.php');
    $max = max($max, filemtime($cwd . 'graph.js'));
    $max = max($max, filemtime($cwd . 'model.js'));
?>

</head>
<body style="margin: 0;">
    <div id="nav_top" style="width: 99%; padding-left: 1%; padding-top: 0.5%; border-bottom: 1px solid black; padding-bottom: 1%;">
        <h2>Covid-19 infection course prediction in Czech republic.</h2>
        This model is based on an elaborate data witch-doctory using observed Covid-19 growth rate in Czech republic.<br/></br>
        Initial data taken from: <a href=https://onemocneni-aktualne.mzcr.cz/covid-19>https://onemocneni-aktualne.mzcr.cz/covid-19</a>.
        Last change: <?php echo date("d/m/y H:i", $max); ?>
    </div>
    <div class="chart-container" style="padding-left: 1%; position: relative; width:75%;">
		<canvas id="infected"></canvas>
	</div>
	<br/><br/><br/>
    <div class="chart-container" style="padding-left: 1%; position: relative; width:75%;">
		<canvas id="growth_rate"></canvas>
	</div>
    <div id="nav_bottom" style="width: 100%; background-color: gold; border: 2px; border-color: black;">
        <div style="padding-left: 3%; float: left;">
            <br/>Future controls here.
		</div>
    </div>
</body>

<!-- GRAPH -->
<script src="graph.js?v=<?php echo filemtime($cwd . 'graph.js'); ?>"></script>

</html>
