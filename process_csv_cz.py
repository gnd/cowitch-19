#!/usr/bin/env python

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
        datum = "%s/%s/%s" % (datum_arr[1], datum_arr[2], datum_arr[0][2:])
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


# Run processing
process_csv('nakazeni-vyleceni-umrti-testy.csv')
