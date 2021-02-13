#!/usr/bin/env python2
import re

def process_csv(name):
    f = file('data/%s.csv' % name,'r')
    lines = f.readlines()
    f.close()

    out = ""
    for line in lines[1:]:
        p = re.compile('(.*)\"(.*)(,)([^\"]*)\"')
        line = p.sub(r'\1\2\4', line)
        arr = line.split(',')
        index = 0
        vals = ""
        for key in lines[0].split(',')[4:]:
            vals += "'%s': %s, " % (key.strip(), arr[4+index].strip())
            index += 1
        if (arr[0] != ""):
            out += "'%s, %s': { %s },\n" % (arr[1].replace("'","\\'"), arr[0], vals.strip(', '))
        else:
            out += "'%s': { %s },\n" % (arr[1].replace("'","\\'"), vals.strip(', '))

    f = file('data/%s.js' % name, 'w')
    if (name == 'confirmed'):
        f.write("global_data = {};\n")
    f.write("global_data['%s'] = {%s};" % (name, out))
    f.close()

process_csv('confirmed')
process_csv('recovered')
process_csv('deaths')
