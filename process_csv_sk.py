#!/usr/bin/env python2

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
        # 2020-01-27,0,0,0,20
        arr = line.split(';')
        datum_arr = arr[0].split("-")
        datum = "%s/%s/%s" % (datum_arr[1].lstrip("0"), datum_arr[0].lstrip("0"), datum_arr[2][2:])
        # create entries like '1/22/20': 0,
        confirmed += "'%s': %s, " % (datum, arr[1])
        recovered += "'%s': %s, " % (datum, arr[2])
        deaths += "'%s': %s, " % (datum, arr[6].strip())
        tests += "'%s': %s, " % (datum, arr[4])

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


# Run processing#
process_csv('slovakia.csv')
