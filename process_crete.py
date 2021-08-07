#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def process_csv(name):
    f = open('data/eody_{}.txt'.format(name),'r')
    lines = f.readlines()
    f.close()

    confirmed = ''
    avg7 = ''
    hundred_k = ''

    for line in lines:
        # example of one row in data:
        # Datum confirmed avg7 100k
        # 1/22/21 100 100 100
        arr = line.split()
        datum = arr[0]
        if len(arr) > 1:
            confirmed += "'{}': {}, ".format(datum, arr[1])
            avg7 += "'{}': {}, ".format(datum, arr[2])
            hundred_k += "'{}': {}, ".format(datum, arr[3])
        else:
            confirmed = "'{}': {}, ".format(datum, 0)
            avg7 = "'{}': {}, ".format(datum, 0)
            hundred_k = "'{}': {}, ".format(datum, 0)

    # Write the data into files - confirmed
    f = open('data/eody_crete.js', 'a')
    f.write("crete_data['confirmed']['{}'] = {{{}}};\n".format(name, confirmed.strip(', ')))
    f.close()
    # Write the data into files - avg7
    f = open('data/eody_crete.js', 'a')
    f.write("crete_data['avg7']['{}'] = {{{}}};\n".format(name, avg7.strip(', ')))
    f.close()
    # Write the data into files - 100k
    f = open('data/eody_crete.js', 'a')
    f.write("crete_data['hundred_k']['{}'] = {{{}}};\n".format(name, hundred_k.strip(', ')))
    f.close()

# Run processing
# clean data file first
f = open('data/eody_crete.js', 'w')
f.write("crete_data = {};\n")
f.close()

# process data from OCR'd pdfs
process_csv('chania')
process_csv('heraklion')
#process_csv('lasithi')
process_csv('rethymno')

