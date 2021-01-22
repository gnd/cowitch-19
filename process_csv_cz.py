#!/usr/bin/env python

months = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}

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
    # Write the data into files - tests
    f = file('data/vaccinated_cz.js', 'w')
    f.write("czech_data['vaccinated'] = {%s};" % (vaccinated_string.strip(', ')))
    f.close()


# Run processing
process_csv('nakazeni-vyleceni-umrti-testy.csv')
process_vaccinated_csv('vaccinated_cz.csv')
