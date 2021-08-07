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

# Input parameters
EXTRACT_MODE=$1
FILE=$2

# function that handles the OCR
ocr_pdf() {
    # receive filename from input
    file=$1

    # extract date from filename
    YEAR=`echo $file | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 3-4`
    MONTH=`echo $file | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 5-6 | sed 's/0//g'`
    DAY=`echo $file | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 7-8 | sed 's/^0//g'`
    DATE="$MONTH/$DAY/$YEAR"

    # extract page 3 till 14.2, otherwise page 4
    if [[ $MONTH -gt 2 ]]; then
        PAGE=4
    elif [[ $MONTH == 2 ]] && [[ $DAY -gt 13 ]]; then
        PAGE=4
    else
        PAGE=3
    fi    

    # extract page from file, convert to jpeg and OCR the jpeg
    pdfseparate -f $PAGE -l $PAGE $file $file"-page_"$PAGE".pdf"
    convert -density 500 -quality 100 $file"-page_"$PAGE".pdf" $file"-page_"$PAGE".jpg"
    tesseract $file"-page_"$PAGE".jpg" $file --psm 6    
    
    # cleanup
    rm $file"-page_"$PAGE".pdf"
    rm $file"-page_"$PAGE".jpg"
}

# function that extracts data from ocr'd documents
extract_daily_stats() {
    # receive filename from input
    file=$1
    city=$2
    
    # set default ubers to zero
    CHANIA_CASES=0
    CHANIA_WEEK_AVG=0
    CHANIA_PER_HUNDRED_K=0
    HERAKLEIO_CASES=0
    HERAKLEIO_WEEK_AVG=0
    HERAKLEIO_PER_HUNDRED_K=0
    LASITHI_CASES=0
    LASITHI_WEEK_AVG=0
    LASITHI_PER_HUNDRED_K=0
    RETHYMNO_CASES=0
    RETHYMNO_WEEK_AVG=0
    RETHYMNO_PER_HUNDRED_K=0

    case $city in
        chania)
            # read results from text file
            if [[ `cat $file | grep XANION | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep XANION | sed 's/.*XANION //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep XANION | sed 's/.*XANION //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep XANION | sed 's/.*XANION //g' | awk {'print $3;'}`
            fi        
        ;;
        heraklion)
            if [[ `cat $file | grep HPAKAEIOY | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $3;'}`
            fi
        ;;
        lasithi)
            if [[ `cat $file | grep AAXIOIOY | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep AAXIOIOY | sed 's/.*AAXIOIOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep AAXIOIOY | sed 's/.*AAXIOIOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep AAXIOIOY | sed 's/.*AAXIOIOY //g' | awk {'print $3;'}`
            elif [[ `cat $file | grep AAZIOIOY | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep AAZIOIOY | sed 's/.*AAZIOIOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep AAZIOIOY | sed 's/.*AAZIOIOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep AAZIOIOY | sed 's/.*AAZIOIOY //g' | awk {'print $3;'}`
            fi
        ;;
        rethymno)
            if [[ `cat $file | grep ΡΕΘΥΜΝΟΥ | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $3;'}`
            elif [[ `cat $file | grep PEOYMNOY | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $3;'}`
            elif [[ `cat $file | grep PEQYMNOY | wc -l` -gt 0 ]]; then
                CASES=`cat $file | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $3;'}`
            elif [[ `cat $file | grep PEOQYMNOY | wc -l` -gt 0 ]]; then 
                CASES=`cat $file | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $file | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $file | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $3;'}`
            fi
        ;;
        *)
            echo "Unknown city"
        ;;
    esac       
    
    # show data
    echo "$CASES $WEEK_AVG $PER_HUNDRED_K"
}



# Run this only once at the beginnign to gat all the historic data
if [[ $EXTRACT_MODE == "bootstrap" ]]; then
    if [[ ! -d data/eody/reports ]]; then
    	mkdir -p data/eody_reports
    fi	
    cd data/eody_reports

    # get all past reports
    $YEAR=`date "+%Y"`
    $CURR_MONTH=`date "+%m"`
    for MONTH in {01..$CURR_MONTH}
    do
        for DAY in {01..31}
        do
            wget https://eody.gov.gr/wp-content/uploads/$YEAR/$MONTH/covid-gr-daily-report-$YEAR$MONTH$DAY.pdf 
        done
    done

    # OCR all past reports
    for file in `ls data/eody_reports`
    do
        ocr_pdf $file
    done
    
    # extract data from all past reports
    for file in `ls data/eody_reports | grep txt`
    do
        # extract date from filename
        Y=`echo $file | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 3-4`
        M=`echo $file | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 5-6 | sed 's/0//g'`
        D=`echo $file | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 7-8 | sed 's/^0//g'`
        DATE="$M/$D/$Y"
        
        for CITY in {chania, heraklion, lasithi, rethymno}
        do
            daily_stats=`extract_daily_stats $file $CITY`
            echo "$DATE $DAILY_STATS" >> data/eody_$CITY.txt
        done
    done
fi

# This is run daily
if [[ $EXTRACT_MODE == "single" ]]; then
    ocr_pdf $FILE
    
    # extract date from filename
    Y=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 3-4`
    M=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 5-6 | sed 's/0//g'`
    D=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 7-8 | sed 's/^0//g'`
    DATE="$M/$D/$Y"

    for CITY in {chania, heraklion, lasithi, rethymno}
    do
        DAILY_STATS=`extract_daily_stats $FILE.txt $CITY`
        echo "$DATE $DAILY_STATS" >> data/eody_$CITY.txt
    done
fi

