import math
import random

def random_entry():
    lines = open('./exampleText.txt').read().splitlines()
    myline =random.choice(lines)

    return myline

def random_name():
    lines = open('./exampleNames.txt').read().splitlines()
    myline =random.choice(lines)

    return myline

random_String = '['
total = 300
for x in xrange(total):
    random_String += '{'
    random_String += '"location": "' + random_entry() + ', London, UK", '
    random_String += '"name": "' +  random_name() + '", '
    random_String += '"age": "' + str(random.randint(13, 65)) + '", '
    random_String += '"phone": "' + str(random.randint(math.pow(10, 11), math.pow(10, 12))) + '"'
    random_String += '}'

    if (x != total - 1):
        random_String += ','

random_String += ']'

print random_String
