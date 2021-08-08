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
    # receive FILEname from input
    FILE=$1

    # extract date from FILEname
    YEAR=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 3-4`
    MONTH=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 5-6 | sed 's/0//g'`
    DAY=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf//g' | cut -c 7-8 | sed 's/^0//g'`
    DATE="$MONTH/$DAY/$YEAR"

    # extract page 3 till 14.2, otherwise page 4
    if [[ $MONTH -gt 2 ]]; then
        PAGE=4
    elif [[ $MONTH == 2 ]] && [[ $DAY -gt 13 ]]; then
        PAGE=4
    else
        PAGE=3
    fi    

    # extract page from FILE, convert to jpeg and OCR the jpeg
    pdfseparate -f $PAGE -l $PAGE $FILE $FILE"-page_"$PAGE".pdf"
    convert -density 500 -quality 100 $FILE"-page_"$PAGE".pdf" $FILE"-page_"$PAGE".jpg"
    tesseract $FILE"-page_"$PAGE".jpg" $FILE --psm 6    
    
    # cleanup
    rm $FILE"-page_"$PAGE".pdf"
    rm $FILE"-page_"$PAGE".jpg"
}

# function that extracts data from ocr'd documents
extract_daily_stats() {
    # receive filename from input
    FILE=$1
    CITY=$2
    
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

    case $CITY in
        chania)
            # read results from text FILE
            if [[ `cat $FILE | grep XANION | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep XANION | sed 's/.*XANION //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep XANION | sed 's/.*XANION //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep XANION | sed 's/.*XANION //g' | awk {'print $3;'}`
            fi        
        ;;
        heraklion)
            if [[ `cat $FILE | grep HPAKAEIOY | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep HPAKAEIOY | sed 's/.*HPAKAEIOY //g' | awk {'print $3;'}`
            fi
        ;;
        lasithi)
            if [[ `cat $FILE | grep AAXIOIOY | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep AAXIOIOY | sed 's/.*AAXIOIOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep AAXIOIOY | sed 's/.*AAXIOIOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep AAXIOIOY | sed 's/.*AAXIOIOY //g' | awk {'print $3;'}`
            elif [[ `cat $FILE | grep AAZIOIOY | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep AAZIOIOY | sed 's/.*AAZIOIOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep AAZIOIOY | sed 's/.*AAZIOIOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep AAZIOIOY | sed 's/.*AAZIOIOY //g' | awk {'print $3;'}`
            fi
        ;;
        rethymno)
            if [[ `cat $FILE | grep ΡΕΘΥΜΝΟΥ | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep ΡΕΘΥΜΝΟΥ | sed 's/.*ΡΕΘΥΜΝΟΥ //g' | awk {'print $3;'}`
            elif [[ `cat $FILE | grep PEOYMNOY | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep PEOYMNOY | sed 's/.*PEOYMNOY //g' | awk {'print $3;'}`
            elif [[ `cat $FILE | grep PEQYMNOY | wc -l` -gt 0 ]]; then
                CASES=`cat $FILE | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep PEQYMNOY | sed 's/.*PEQYMNOY //g' | awk {'print $3;'}`
            elif [[ `cat $FILE | grep PEOQYMNOY | wc -l` -gt 0 ]]; then 
                CASES=`cat $FILE | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $1;'}`
                WEEK_AVG=`cat $FILE | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $2;'}`
                PER_HUNDRED_K=`cat $FILE | grep PEOQYMNOY | sed 's/.*PEOQYMNOY //g' | awk {'print $3;'}`
            fi
        ;;
        *)
            echo "Unknown CITY"
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
    YEAR=`date "+%Y"`
    for MONTH in {01..08}
    do
        for DAY in {01..31}
        do
            wget https://eody.gov.gr/wp-content/uploads/$YEAR/$MONTH/covid-gr-daily-report-$YEAR$MONTH$DAY.pdf 
        done
    done
    
    # fix bad files
    wget https://eody.gov.gr/wp-content/uploads/$YEAR/06/covid-gr-daily-report-20210609-2.pdf -O covid-gr-daily-report-20210609.pdf
    wget https://eody.gov.gr/wp-content/uploads/$YEAR/04/covid-gr-daily-report-202104302.pdf -O covid-gr-daily-report-20210430.pdf
    # lol no data for 2nd of May
    wget https://eody.gov.gr/wp-content/uploads/$YEAR/05/covid-gr-daily-report-20210501.pdf -O covid-gr-daily-report-20210502.pdf
    wget https://eody.gov.gr/wp-content/uploads/$YEAR/05/covid-gr-daily-report-202105142.pdf -O covid-gr-daily-report-20210514.pdf

    # OCR all past reports
    for FILE in `ls|grep -v txt`
    do
        echo "Doing OCR for $FILE"
        ocr_pdf $FILE
    done
    
    # delete previous data if any
    for CITY in chania heraklion lasithi rethymno
    do
        rm ../eody_$CITY.txt
    done
    
    # extract data from all past reports
    for FILE in `ls | grep txt`
    do
        # extract date from Filename
        Y=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 3-4`
        M=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 5-6 | sed 's/0//g'`
        D=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 7-8 | sed 's/^0//g'`
        DATE="$M/$D/$Y"
        
        for CITY in chania heraklion lasithi rethymno
        do
            echo "Extracting data from $FILE"
            DAILY_STATS=`extract_daily_stats $FILE $CITY`
            echo "$DATE $DAILY_STATS" >> ../eody_$CITY.txt
        done
    done


# This is run daily
elif [[ $EXTRACT_MODE == "single" ]]; then
    cd data/eody_reports
    
    # check for input sanity
    if [[ -z $FILE ]]; then
        echo "Please provide input file."
        exit
    fi
    if [[ ! -f $FILE ]]; then
        echo "File $FILE does not exist."
        exit
    fi
    
    # OCR the fie 
    echo "Doing OCR for $FILE"   
    ocr_pdf $FILE
    
    # extract date from FILEname
    Y=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 3-4`
    M=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 5-6 | sed 's/0//g'`
    D=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 7-8 | sed 's/^0//g'`
    DATE="$M/$D/$Y"

    for CITY in chania heraklion lasithi rethymno
    do
        echo "Extracting data from $FILE.txt"
        DAILY_STATS=`extract_daily_stats $FILE.txt $CITY`
        echo "$DATE $DAILY_STATS" >> ../eody_$CITY.txt
    done


# This is run daily
elif [[ $EXTRACT_MODE == "manual" ]]; then
    # check for input sanity
    if [[ -z $FILE ]]; then
        echo "Please provide input file."
        exit
    fi
    if [[ ! -f $FILE ]]; then
        echo "File $FILE does not exist."
        exit
    fi
    
    # OCR the fie 
    echo "Doing OCR for $FILE"   
    ocr_pdf $FILE
    
    # extract date from FILEname
    Y=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 3-4`
    M=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 5-6 | sed 's/0//g'`
    D=`echo $FILE | sed 's/.*-//g' | sed 's/\.pdf\.txt//g' | cut -c 7-8 | sed 's/^0//g'`
    DATE="$M/$D/$Y"

    DAILY_STATS=`extract_daily_stats $FILE.txt chania`
    echo "Chania: $DATE $DAILY_STATS"
    DAILY_STATS=`extract_daily_stats $FILE.txt heraklion`
    echo "Heraklion: $DATE $DAILY_STATS"
    DAILY_STATS=`extract_daily_stats $FILE.txt lasithi`
    echo "Lasithi: $DATE $DAILY_STATS"
    DAILY_STATS=`extract_daily_stats $FILE.txt rethymno`
    echo "Rethymno: $DATE $DAILY_STATS"
    

else
    echo "Usage ./eody_extract [bootstrap | single <file> | manual <file> ]"
fi

