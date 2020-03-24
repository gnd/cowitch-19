<html>
<head>
<title>
    cowitch-19 - pseudo-scientific curve prediction yay!
</title>

<!--TODO:

- add rolling average for infection rate
- fix interface:
    - add correct datetime to labels
    - fix colors and graph style
- what is the correct name - infection rate ? rate of spread ?
- add graph for rate of spread
- add a way to access older states (eg. state from 22.3, etc)
- add a small probabilistic jitter to the scenario, run several times:
    - rate of spread jitter
    - speed / rate of decline jitter
- add several scenarios (current, optimistic)
- look into dead / healthy - cumulative or not ?
- add healed / dead / new per day
- add tables to graphs
- add interface to change params from web

- use the SIER methodology to predict longterm
- population size, immune pool, dead pool, etc

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
    current_values = [3,3,5,5,8,19,26,32,38,63,94,116,141,189,298,383,464,572,774,904,1047,1165,1289];
    days_elapsed = fill_initial(data, current_values);

    // Prepare the model
    model = {};
    MAXDAYS = 180;

    // Create infection_rate seed for the model
    var rate_seed = {};
    for (var i=0; i < 20; i++) {
        rate_seed[i] = data['infection_rate_avg'][i];
    }

    rate_seed[20] = 1.2; // czech government enforced mandatory quarantaine on 14.3, we should start seeing the effects around 21.3
    // Create infected seed for the model
    var new_seed = {};
    for (var i=0; i < days_elapsed; i++) {
        new_seed[i] = data['infected_confirmed'][i];
    }

    // Put together the models parameters
    var model1 = new params(
        'Projekcia',
        MAXDAYS,
        rate_seed,
        'log',
        100,
        1.01,
        new_seed,
    );

    // Run the model
    run_model( model1 );
</script>

<!-- MOBILE & DESKTOP STYLES -->
<link rel="stylesheet" media='screen' href="style.css"/>

</head>
<body style="margin: 0;">
    <div id="nav_top" style="width: 99%; padding-left: 1%; padding-top: 0.5%; border-bottom: 1px solid black; padding-bottom: 1%;">
        Covid-19 infection course prediction in Czechia based on data from: <a href=https://onemocneni-aktualne.mzcr.cz/covid-19>https://onemocneni-aktualne.mzcr.cz/covid-19</a>
    </div>
    <div class="chart-container" style="padding-left: 1%; position: relative; width:85%; height:83%;">
		<canvas id="full"></canvas>
	</div>
	<br/><br/><br/>
    <div id="nav_bottom" style="width: 100%; background-color: gold; border: 2px; border-color: black;">
        <div style="padding-left: 3%; float: left;">
            <br/>Future controls here.
		</div>
    </div>
</body>

<!-- GRAPH -->
<script src="graph.js?v=<?php echo filemtime($cwd . 'graph.js'); ?>"></script>

</html>
