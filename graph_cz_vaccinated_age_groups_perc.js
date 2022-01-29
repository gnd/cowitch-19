// Create datasets for vaccinations
labels = [];
dose_1 = [];
dose_2 = [];
dose_1_only = [];
no_dose = [];
all = population_size_by_age['cz'];
for (var i=0; i<age_slots.length; i++) {
    labels.push(age_slots_desc[i]);
    var d1, d2;
    d1 = current_values['cz_vaccinated_a_' + age_slots[i]].slice(-1)[0] / all[i] * 100;
    d2 = current_values['cz_vaccinated_b_' + age_slots[i]].slice(-1)[0] / all[i] * 100;
    dose_1.push( d1 );
    dose_2.push( d2 );
    dose_1_only.push( d1 - d2 );
    no_dose.push( 100 - d1 );
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
var vaccinated_chart_cz_age_groups_perc = document.getElementById("vaccinated_cz_age_groups_perc").getContext('2d');

// The vaccinations chart
window.vaccinated_chart = new Chart(vaccinated_chart_cz_age_groups_perc, {
  type: 'bar',
  data: data,
  options: {
    elements: {
      bar: {
        borderWidth: 2,
        barThickness: 1
      }
    },
    scales: {
        yAxes: [{
            gridLines: {
                color: 'rgba(150,150,150,1)',
                lineWidth: 1,
            },
            ticks: {
                stepSize: 10
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

