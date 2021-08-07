#!/bin/bash

if [[ ! -d data/eody/reports ]]; then
	mkdir -p data/eody_reports
fi	
cd data/eody_reports

for k in {01..08}
do
	for l in {01..31}
	do
		wget --limit-rate=500k https://eody.gov.gr/wp-content/uploads/2021/$k/covid-gr-daily-report-2021$k$l.pdf 
	done
done
