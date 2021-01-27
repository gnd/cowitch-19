#!/usr/bin/env python

from operator import itemgetter

months = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}
age_slots = ['18-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','65-69','70-74','75-79','80+']

def process_csv(name):
    f = file('data/%s' % name,'r')
    lines = f.readlines()
    f.close()

    confirmed = ""
    recovered = ""
    deaths = ""
    tests = ""
    # start from line 35 which is 1st of March 2020, when the first cases were documented in Czechia
    for line in lines[35:]:
        # example of one row in data:
        # 2020-01-27,0,0,0,20
        arr = line.split(',')
        datum_arr = arr[0].split("-")
        datum = "%s/%s/%s" % (datum_arr[1].lstrip("0"), datum_arr[2].lstrip("0"), datum_arr[0][2:])
        # create entries like '1/22/20': 0,
        confirmed += "'%s': %s, " % (datum, arr[1])
        recovered += "'%s': %s, " % (datum, arr[2])
        deaths += "'%s': %s, " % (datum, arr[3])
        tests += "'%s': %s, " % (datum, arr[4].strip())

    # Write the data into files - confirmed
    f = file('data/confirmed_cz.js', 'w')
    f.write("czech_data = {};\n")
    f.write("czech_data['confirmed'] = {%s};" % (confirmed.strip(', ')))
    f.close()
    # Write the data into files - recovered
    f = file('data/recovered_cz.js', 'w')
    f.write("czech_data['recovered'] = {%s};" % (recovered.strip(', ')))
    f.close()
    # Write the data into files - deaths
    f = file('data/deaths_cz.js', 'w')
    f.write("czech_data['deaths'] = {%s};" % (deaths.strip(', ')))
    f.close()
    # Write the data into files - tests
    f = file('data/tests_cz.js', 'w')
    f.write("czech_data['tests'] = {%s};" % (tests.strip(', ')))
    f.close()


def process_vaccinated_csv(name):
    f = file('data/%s' % name,'r')
    lines = f.readlines()
    f.close()

    vaccinated = 0
    vaccinated_string = ""
    for line in lines[1:]:
        # example of one row in data:
        "Jan 16, 2021",3211
        arr = line.split(',')
        month_day_arr = arr[0].split()
        datum = "%s/%s/%s" % (months[month_day_arr[0].lstrip('"')], month_day_arr[1], arr[1].strip()[2:4])
        # we turn the data into cumulative
        vaccinated += int(arr[2].strip())
        # create entries like '1/22/20': 0,
        vaccinated_string += "'%s': %d, " % (datum, vaccinated)
    # Write the data into files - vaccinated
    f = file('data/vaccinated_cz.js', 'w')
    f.write("czech_data['vaccinated'] = {%s};" % (vaccinated_string.strip(', ')))
    f.close()
    
    
def process_vaccinated_details(name):
    f = file('data/%s' % name, 'r')
    lines = f.readlines()
    f.close()

    vaccinated_a = {} # first dose
    vaccinated_b = {} # second dose
    # create age slots in vaccinated
    for age in age_slots:
        vaccinated_a[age] = {}
        vaccinated_b[age] = {}
    for line in lines[1:]:
        # 2021-01-26,Comirnaty,CZ080,"Moravskoslezsky kraj",18-24,0,18,18\r\n'
        line_data = line.split(',')
        line_date = line_data[0]
        line_age  = line_data[4]
        
        # Make sure vaccinated always exists for the given day and all age groups
        for age in age_slots:
            if (line_date not in vaccinated_a[age]):
                vaccinated_a[age][line_date] = 0
            if (line_date not in vaccinated_b[age]):
                vaccinated_b[age][line_date] = 0
        
        # add data from line
        if (line_age in age_slots):
            vaccinated_a[line_age][line_date] += int(line_data[5])
            vaccinated_b[line_age][line_date] += int(line_data[6])
    
    # prepare output
    output = ""
    for age in age_slots:
        age_total_a = 0
        age_total_b = 0
        nice_age = age[0:2]
        # process vaccinated_a first - first dose of the vaccine
        vaccinated_age_string = ""
        for tuple in sorted(vaccinated_a[age].items(), key=itemgetter(0)):
            # 01/26/21
            nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
            age_total_a += tuple[1]
            vaccinated_age_string += "'%s': %d, " % (nice_date, age_total_a)
        output += "czech_data['vaccinated_a_%s'] = {%s};\n" % (nice_age, vaccinated_age_string.strip(', '))
        # process vaccinated_b next - second dose of the vaccine
        vaccinated_age_string = ""
        for tuple in sorted(vaccinated_b[age].items(), key=itemgetter(0)):
            # 01/26/21
            nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
            age_total_b += tuple[1]
            vaccinated_age_string += "'%s': %d, " % (nice_date, age_total_b)
        output += "czech_data['vaccinated_b_%s'] = {%s};\n" % (nice_age, vaccinated_age_string.strip(', '))
    
    # write to file
    f = file('data/vaccinated_cz_details.js', 'w')
    f.write(output)
    f.close()

# Run processing
process_csv('nakazeni-vyleceni-umrti-testy.csv')
process_vaccinated_csv('vaccinated_cz.csv')
process_vaccinated_details('vaccinated_cz_details.csv')
