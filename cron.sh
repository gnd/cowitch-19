#!/bin/bash
DIR=`dirname "$0"`
cd $DIR

# download new czech data
wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv -O data/confirmed.csv
wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv -O data/deaths.csv
wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv -O data/recovered.csv
wget https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.csv -O data/nakazeni-vyleceni-umrti-testy.csv
wget https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani.csv -O data/vaccinated_cz_details.csv

# download new slovak data
wget https://raw.githubusercontent.com/Institut-Zdravotnych-Analyz/covid19-data/main/DailyStats/OpenData_Slovakia_Covid_DailyStats.csv -O data/slovakia.csv
wget https://mapa.covid.chat/export/csv -O data/slovakia.csv
wget https://raw.githubusercontent.com/Institut-Zdravotnych-Analyz/covid19-data/main/Vaccination/OpenData_Slovakia_Vaccination_Regions.csv -O data/vaccinated_sk_details.csv

# download greek data
YEAR=`date "+%Y"`
MONTH=`date "+%m"`
DATE_STRING=`date "+%m%d"`
if [[ ! -f data/eody_reports/covid-gr-daily-report-$YEAR$DATE_STRING.pdf ]]; then
    echo "Trying to get latest Greek data"
    curl -f https://eody.gov.gr/wp-content/uploads/$YEAR/$MONTH/covid-gr-daily-report-$YEAR$DATE_STRING.pdf -o data/eody_reports/covid-gr-daily-report-$YEAR$DATE_STRING.pdf
else 
    echo "Not re-downloading covid-gr-daily-report-$YEAR$DATE_STRING.pdf"
fi

# now turn it into JS arrays
echo "Processing data .."
$DIR/process_csv.py
$DIR/process_csv_cz.py
$DIR/process_csv_sk.py
$DIR/process_crete.py
