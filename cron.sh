#!/bin/sh
DIR=`dirname "$0"`
cd $DIR

# download new czech data
wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv -O data/confirmed.csv
wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv -O data/deaths.csv
wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv -O data/recovered.csv
wget https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.csv -O data/nakazeni-vyleceni-umrti-testy.csv
wget https://share.uzis.cz/s/ZEAZtS4dWQXKWF4/download -O data/vaccinated_cz.csv
wget https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani.csv -O data/vaccinated_cz_details.csv

# download new slovak data
wget https://mapa.covid.chat/export/csv -O data/slovakia.csv

# now turn it into JS arrays
echo "Processing data .."
$DIR/process_csv.py
$DIR/process_csv_cz.py
$DIR/process_csv_sk.py
