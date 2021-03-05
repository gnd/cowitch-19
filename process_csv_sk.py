#!/usr/bin/env python2
# -*- coding: utf-8 -*-

from operator import itemgetter

def process_csv(name):
    f = file('data/%s' % name,'r')
    lines = f.readlines()
    f.close()

    confirmed = "" # [1]
    recovered = "" # [2]
    deaths = "" # [6]
    tests = "" # [4]
    # start from 1.3.2020 and create empty entries for the first 5 days
    #for i in range(5):
    #    datum = "%s/%s/%s" % (i+1, 03, 2020)
    #    confirmed += "'%s': %s, " % (datum, 0)
    #    recovered += "'%s': %s, " % (datum, 0)
    #    deaths += "'%s': %s, " % (datum, 0)
    #    tests += "'%s': %s, " % (datum, 0)
    for line in lines[1:]:
        # example of one row in data:
        # "Datum";"Pocet.potvrdenych.PCR.testami";"Dennych.PCR.testov";"Dennych.PCR.prirastkov";"Pocet.umrti";"AgTests";"AgPosit"
        # 2021-02-14;278254;2775;572;5952;249092;2392
        arr = line.split(';')
        datum_arr = arr[0].split("-")
        datum = "%s/%s/%s" % (datum_arr[1].lstrip("0"), datum_arr[2].lstrip("0"), datum_arr[0][2:])
        # create entries like '1/22/20': 0,
        confirmed += "'%s': %s, " % (datum, arr[1])
        # slovak gov has stopped publishing this data :/
        # recovered += "'%s': %s, " % (datum, arr[2])
        recovered += "'%s': %s, " % (datum, 0)
        deaths += "'%s': %s, " % (datum, arr[4])
        tests += "'%s': %s, " % (datum, arr[2])

    # Write the data into files - confirmed
    f = file('data/confirmed_sk.js', 'w')
    f.write("slovak_data = {};\n")
    f.write("slovak_data['confirmed'] = {%s};" % (confirmed.strip(', ')))
    f.close()
    # Write the data into files - recovered
    f = file('data/recovered_sk.js', 'w')
    f.write("slovak_data['recovered'] = {%s};" % (recovered.strip(', ')))
    f.close()
    # Write the data into files - deaths
    f = file('data/deaths_sk.js', 'w')
    f.write("slovak_data['deaths'] = {%s};" % (deaths.strip(', ')))
    f.close()
    # Write the data into files - tests
    f = file('data/tests_sk.js', 'w')
    f.write("slovak_data['tests'] = {%s};" % (tests.strip(', ')))
    f.close()

def process_vaccinated_details(name):
    f = file('data/%s' % name, 'r')
    lines = f.readlines()
    lines = lines[1:]
    lines.reverse()
    f.close()

    vaccinated_a = {} # first dose
    vaccinated_b = {} # second dose
    # create totals in vaccinated
    vaccinated_a['total'] = {} # daily total
    vaccinated_b['total'] = {} # daily total
    # Process data from the CSV line by line
    for line in lines:
        # 2021-03-04;"Bratislavský kraj";"SK010";269;842
        line_data = line.split(';')
        line_date = line_data[0]
        
        #        
        # Process data about first and second doses - total over all age groups
        # First make sure the date exists in vaccinated_{a|b}['total'] arrays
        #
        if (line_date not in vaccinated_a['total']):
            vaccinated_a['total'][line_date] = 0
        if (line_date not in vaccinated_b['total']):
            vaccinated_b['total'][line_date] = 0
        # Second, add data from line
        vaccinated_a['total'][line_date] += int(line_data[3])
        vaccinated_b['total'][line_date] += int(line_data[4])

    # prepare output
    output = ""
    # add first dose totals
    age_total_a = 0
    vaccinated_age_string = ""
    for tuple in sorted(vaccinated_a['total'].items(), key=itemgetter(0)):
        # 01/26/21
        nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
        age_total_a += tuple[1]
        vaccinated_age_string += "'%s': %d, " % (nice_date, age_total_a)
    output += "slovak_data['vaccinated_a_total'] = {%s};\n" % (vaccinated_age_string.strip(', '))
    # add first dose totals
    age_total_b = 0
    vaccinated_age_string = ""
    for tuple in sorted(vaccinated_b['total'].items(), key=itemgetter(0)):
        # 01/26/21
        nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
        age_total_b += tuple[1]
        vaccinated_age_string += "'%s': %d, " % (nice_date, age_total_b)
    output += "slovak_data['vaccinated_b_total'] = {%s};\n" % (vaccinated_age_string.strip(', '))

    # write to file
    f = file('data/vaccinated_sk_details.js', 'w')
    f.write(output)
    f.close()


# Run processing#
process_csv('slovakia.csv')
process_vaccinated_details('vaccinated_sk_details.csv')