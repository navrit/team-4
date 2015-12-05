from twilio.rest import TwilioRestClient
#import MySQLdb as mdb
import datetime
import re

# Account credentials here
ACCOUNT_SID = "AC7dc57255a855140dc9c2552589345e81"
AUTH_TOKEN = "5376c083003cc2ba3e06b2d9ef9ea636"

client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
messages = client.messages.list()

def fileHandling():
    # Open filestream to current messagesSID.txt file.
    oldSID = open("messageSID.txt", "r")

    firstSID = oldSID.readline()

    # Iterate through twilio's list of messageSIDs.
    for newSID in messages:
    	if((newSID.sid+"\n") != firstSID):# If there's a new one, call parse and inject functions
    		inject(newSID.body)
    	else:
    		pass

    writer = open("messageSID.txt", "w") # Update our now out of date messages list.

    for m in messages:
    	writer.write(m.sid)
    	writer.write("\n")

    writer.close()

def parse(text):
    # PARSE IT WITH REGEX >> ars;23;Uganda..... --> Name:ars Age:23 Location:Uganda
<<<<<<< HEAD
    
    dataList = re.split(r';{1,}', text)
    dataList = [re.sub(r'\n', ' ', attributes) for attributes in dataList]

    return dataList
=======
    name = text.split(";")[0]
    age = text.split(";")[1]
    location = text.split(";")[2]
    phone = text.split(";")[3]
    issues = text.split(";")[4]
    condtype = text.split(";")[5]
    return name, age, location, phone, issues, condtype
>>>>>>> b31366f185dd4855c6bdf60980bff2ebdfbde521

def inject(text):
    db = mdb.connect('127.0.0.1','root','jpmorgan','codeforgood')
    cursor = db.cursor()
    # Parse then inject into database
    print text
    time, name, age, location, phone, issue, condtypes = parse(text)
    ''' SAMPLE DATA
    name = "Augustus"
    age = "14"
    location = "Uganda High Commission, Nairobi, Kenya"
    phone = "254204445420"
    issue = "No braille access at work"
    condtype = "Visually impaired, wheelchair" '''
    # Inject into database
    query = "INSERT INTO codeforgood.data VALUES('{}','{}','{}','{}','{}','{}');".format(name, age, location, phone, issue, condtype)
    cursor.execute(query)
    db.commit()
    print ">> SUCCESS: New data in DB"
