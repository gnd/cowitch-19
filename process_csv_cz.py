#!/usr/bin/env python2

from operator import itemgetter

months = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}
age_slots = ['18-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','65-69','70-74','75-79','80+']
used_vaccines = {'Comirnaty': 'Pfizer', '"COVID-19 Vaccine Moderna"': 'Moderna', '"COVID-19 Vaccine AstraZeneca"': 'AstraZeneca', 'VAXZEVRIA': 'AstraZeneca', '"COVID-19 Vaccine Janssen"': 'JohnsonJohnson', 'Other': 'Other'}

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
    # create totals in vaccinated
    vaccinated_a['total'] = {} # daily total
    vaccinated_b['total'] = {} # daily total
    # create used vaccine slots in vaccinated
    vaccine_types = used_vaccines.values()
    vaccine_types.append('other')
    for vaccine in vaccine_types:
        vaccinated_a[vaccine] = {}
        vaccinated_b[vaccine] = {}
    # Process data from the CSV line by line
    for line in lines[1:]:
        # 2021-01-26,Comirnaty,CZ080,"Moravskoslezsky kraj",18-24,0,18,18\r\n'
        line_data = line.split(',')
        line_date = line_data[0]
        line_vaccine = line_data[1]
        line_age  = line_data[4]
        
        #
        # Process data about first and second doses broken down by age
        # First make sure the date exists in vaccinated_{a|b}[age] arrays
        #
        for age in age_slots:
            if (line_date not in vaccinated_a[age]):
                vaccinated_a[age][line_date] = 0
            if (line_date not in vaccinated_b[age]):
                vaccinated_b[age][line_date] = 0
        # Second, add data from line
        if (line_age in age_slots):
            vaccinated_a[line_age][line_date] += int(line_data[5])
            vaccinated_b[line_age][line_date] += int(line_data[6])
        
        #        
        # Process data about first and second doses - total over all age groups
        # First make sure the date exists in vaccinated_{a|b}['total'] arrays
        #
        if (line_date not in vaccinated_a['total']):
            vaccinated_a['total'][line_date] = 0
        if (line_date not in vaccinated_b['total']):
            vaccinated_b['total'][line_date] = 0
        # Second, add data from line
        vaccinated_a['total'][line_date] += int(line_data[5])
        vaccinated_b['total'][line_date] += int(line_data[6])

        #
        # Process data about first and second doses - total over all vaccines used
        # First make sure the date exists in vaccinated_{a|b}['total'] arrays
        #
        for vaccine in used_vaccines.values():
            if (line_date not in vaccinated_a[vaccine]):
                vaccinated_a[vaccine][line_date] = 0
            if (line_date not in vaccinated_b[vaccine]):
                vaccinated_b[vaccine][line_date] = 0
        # Second, add data from line
        if (line_vaccine in used_vaccines):
            vaccine = used_vaccines[line_vaccine]
            vaccinated_a[vaccine][line_date] += int(line_data[5])
            vaccinated_b[vaccine][line_date] += int(line_data[6])
        else:
            vaccinated_a['Other'][line_date] += int(line_data[5])
            vaccinated_b['Other'][line_date] += int(line_data[6])
    
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
    # add first dose totals
    age_total_a = 0
    vaccinated_age_string = ""
    for tuple in sorted(vaccinated_a['total'].items(), key=itemgetter(0)):
        # 01/26/21
        nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
        age_total_a += tuple[1]
        vaccinated_age_string += "'%s': %d, " % (nice_date, age_total_a)
    output += "czech_data['vaccinated_a_total'] = {%s};\n" % (vaccinated_age_string.strip(', '))
    # add first dose totals
    age_total_b = 0
    vaccinated_age_string = ""
    for tuple in sorted(vaccinated_b['total'].items(), key=itemgetter(0)):
        # 01/26/21
        nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
        age_total_b += tuple[1]
        vaccinated_age_string += "'%s': %d, " % (nice_date, age_total_b)
    output += "czech_data['vaccinated_b_total'] = {%s};\n" % (vaccinated_age_string.strip(', '))
    # add totals by vaccine type + expand by 'others'
    vaccine_types = used_vaccines.values()
    for vaccine in vaccine_types:
        vaccine_total_a = 0
        vaccine_total_b = 0
        # process vaccinated_a first - first dose of the vaccine
        vaccinated_type_string = ""
        for tuple in sorted(vaccinated_a[vaccine].items(), key=itemgetter(0)):
            # 01/26/21
            nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
            vaccine_total_a += tuple[1]
            vaccinated_type_string += "'%s': %d, " % (nice_date, vaccine_total_a)
        output += "czech_data['vaccinated_a_%s'] = {%s};\n" % (vaccine, vaccinated_type_string.strip(', '))
        # process vaccinated_b next - second dose of the vaccine
        vaccinated_type_string = ""
        for tuple in sorted(vaccinated_b[vaccine].items(), key=itemgetter(0)):
            # 01/26/21
            nice_date = "%s/%s/%s" % (tuple[0].split('-')[1].lstrip("0"),tuple[0].split('-')[2].lstrip("0"),tuple[0].split('-')[0][2:4])
            vaccine_total_b += tuple[1]
            vaccinated_type_string += "'%s': %d, " % (nice_date, vaccine_total_b)
        output += "czech_data['vaccinated_b_%s'] = {%s};\n" % (vaccine, vaccinated_type_string.strip(', '))
    
    # write to file
    f = file('data/vaccinated_cz_details.js', 'w')
    f.write(output)
    f.close()

# Run processing
process_csv('nakazeni-vyleceni-umrti-testy.csv')
process_vaccinated_details('vaccinated_cz_details.csv')
