#!/bin/bash
#
#   This script extracts data from EODY PDF reports
#
#   The following cities are extracted:
#       - Herakleion
#       - Chania
#       - Rethymno
#
#   gnd, 2021
file=$1

HERAKLEIO_CASES=0
HERAKLEIO_WEEK_AVG=0
HERAKLEIO_PER_HUNDRED_K=0
CHANIA_CASES=0
CHANIA_WEEK_AVG=0
CHANIA_PER_HUNDRED_K=0
RETHYMNO_CASES=0
RETHYMNO_WEEK_AVG=0
RETHYMNO_PER_HUNDRED_K=0

# extract date from filename
YEAR=`echo $file | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 3-4`
MONTH=`echo $file | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 5-6 | sed 's/0//g'`
DAY=`echo $file | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 7-8 | sed 's/^0//g'`
DATE="$MONTH/$DAY/$YEAR"

#  1988  rm data/eody*.txt; for mon in {01..08}; do for day in {01..31}; do echo "----- $day/$mon -----"; ./eody_extract.sh data/eody_reports/covid-gr-daily-report-2021$mon$day.pdf; done; done
if [[ -f $file ]]; then
    pdfseparate -f 4 -l 4 $file $file-page_4.pdf
    convert -density 500 -quality 100 $file-page_4.pdf $file-page_4.jpg
    tesseract $file-page_4.jpg $file --psm 6

    HERAKLEIO_CASES=`cat $file.txt | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $1;'}`
    HERAKLEIO_WEEK_AVG=`cat $file.txt | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $2;'}`
    HERAKLEIO_PER_HUNDRED_K=`cat $file.txt | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $3;'}`

    CHANIA_CASES=`cat $file.txt | grep XANION | sed 's/.*XANION //g' | awk {'print $1;'}`
    CHANIA_WEEK_AVG=`cat $file.txt | grep XANION | sed 's/.*XANION //g' | awk {'print $2;'}`
    CHANIA_PER_HUNDRED_K=`cat $file.txt | grep XANION | sed 's/.*XANION //g' | awk {'print $3;'}`

    if [[ `cat $file.txt | grep ΡΕΘΥΜΝΟΥ | wc -l` -gt 0 ]]; then
        RETHYMNO_CASES=`cat $file.txt | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $1;'}`
        RETHYMNO_WEEK_AVG=`cat $file.txt | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $2;'}`
        RETHYMNO_PER_HUNDRED_K=`cat $file.txt | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $3;'}`
    elif [[ `cat $file.txt | grep PEOYMNOY | wc -l` -gt 0 ]]; then
        RETHYMNO_CASES=`cat $file.txt | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $1;'}`
        RETHYMNO_WEEK_AVG=`cat $file.txt | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $2;'}`
        RETHYMNO_PER_HUNDRED_K=`cat $file.txt | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $3;'}`
    elif [[ `cat $file.txt | grep PEQYMNOY | wc -l` -gt 0 ]]; then
        RETHYMNO_CASES=`cat $file.txt | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $1;'}`
        RETHYMNO_WEEK_AVG=`cat $file.txt | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $2;'}`
        RETHYMNO_PER_HUNDRED_K=`cat $file.txt | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $3;'}`
    elif [[ `cat $file.txt | grep PEOQYMNOY | wc -l` -gt 0 ]]; then 
	RETHYMNO_CASES=`cat $file.txt | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $1;'}`
        RETHYMNO_WEEK_AVG=`cat $file.txt | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $2;'}`
        RETHYMNO_PER_HUNDRED_K=`cat $file.txt | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $3;'}`
    fi

    # cleanup
    rm $file-page_4.pdf
    rm $file-page_4.jpg

    # show data
    echo "HERAKLION: $HERAKLEIO_CASES $HERAKLEIO_WEEK_AVG $HERAKLEIO_PER_HUNDRED_K"
    echo "CHANIA: $CHANIA_CASES $CHANIA_WEEK_AVG $CHANIA_PER_HUNDRED_K"
    echo "RETHYMNO: $RETHYMNO_CASES $RETHYMNO_WEEK_AVG $RETHYMNO_PER_HUNDRED_K"
fi 

# put data into files
echo "$DATE $HERAKLEIO_CASES $HERAKLEIO_WEEK_AVG $HERAKLEIO_PER_HUNDRED_K" >> data/eody_heraklion.txt
echo "$DATE $CHANIA_CASES $CHANIA_WEEK_AVG $CHANIA_PER_HUNDRED_K"  >> data/eody_chania.txt
echo "$DATE $RETHYMNO_CASES $RETHYMNO_WEEK_AVG $RETHYMNO_PER_HUNDRED_K" >> data/eody_rethymno.txt
