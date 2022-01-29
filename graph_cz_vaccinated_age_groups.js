// Create datasets for vaccinations
labels = [];
dose_1 = [];
dose_2 = [];
dose_1_only = [];
no_dose = [];
all = population_size_by_age['cz'];
for (var i=0; i < age_slots.length; i++) {
    labels.push(age_slots_desc[i]);
    var d1, d2;
    d1 = current_values['cz_vaccinated_a_' + age_slots[i]].slice(-1)[0];
    d2 = current_values['cz_vaccinated_b_' + age_slots[i]].slice(-1)[0];
    dose_1.push( d1 );
    dose_2.push( d2 );
    dose_1_only.push( d1 - d2 );
    no_dose.push( all[i] - d1 ); 
}

// Put it all together
var cz_vacc_data = {
  labels: labels,
  datasets: [
        {
            label: 'Not vaccinated',
            data: no_dose,
            borderColor: '#ff0000',
            backgroundColor: '#ff0000'
        },
        {
            label: '1st dose only',
            data: dose_1_only,
            borderColor: '#f2b705',
            backgroundColor: '#f2b705'
        },
        {
            label: 'Fully vaccinated',
            data: dose_2,
            borderColor: '#d96704',
            backgroundColor: '#d96704'
        }
    ]
};

// the growth rate
var vaccinated_chart_cz_age_groups = document.getElementById("vaccinated_cz_age_groups").getContext('2d');

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_cz_age_groups, {
  type: 'bar',
  data: cz_vacc_data,
  options: {
    grouped: true,
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    legend: {
        display: true,
        labels: {
            fontSize: 15,
            fontColor: 'rgba(150,150,150,1)',
        },
    },
    scales: {
        yAxes: [{
            gridLines: {
                color: 'rgba(120,120,120,1)',
                lineWidth: 1,
            },
            ticks: {
                stepSize: 50000
            },
            stacked: true
        }],
        xAxes: [{
            stacked: true
        }]
    },
    responsive: true
  }
} );

