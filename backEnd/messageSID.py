from twilio.rest import TwilioRestClient
import MySQLdb as mdb
import re

# Twilio account credentials
ACCOUNT_SID = "AC7dc57255a855140dc9c2552589345e81"
AUTH_TOKEN = "5376c083003cc2ba3e06b2d9ef9ea636"

# Connect to Twilio's RESTful API with authentication
client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
# Get all messages from Twilio
messages = client.messages.list()

def fileHandling():
    # Open filestream to last messagesSID.txt file - last list of messages
    oldSID = open("messageSID.txt", "r")

    # Get 1st line of the old message ID list
    firstSID = oldSID.readline()

    # Iterate through Twilio's list of messageSIDs
    for newSID in messages:
    	if((newSID.sid+"\n") != firstSID):
    		inject(newSID.body) # If there's a new one, call parse and inject functions
    	else:
    		break

    # Update our now out of date messages list
    writer = open("messageSID.txt", "w")

    for m in messages:
    	writer.write(m.sid)
    	writer.write("\n")

    try:
        writer.close() # Safely close the file
    except IOException as e:
        print ">> IO ERROR"

def parse(text):
    dataList = re.split(r';{1,}', text) # Puts text into a list where each element is seperated by ;
    dataList = [re.sub(r'\n', ' ', attributes) for attributes in dataList] # Gets rid of unwanted newline chars.

    # Assign relevant variables to
    name = str(dataList[0])
    age = int(dataList[1])
    location= str(dataList[2])
    phone = int(dataList[3])
    issue = str(dataList[4])
    condtype = str(dataList[5])
    return name, age, location, phone, issue, condtype

def unpack(a, b, c, d, e, f, *rest):
    return a, b, c, d, e, f, rest


    ''' SAMPLE DATA FOR INJECT

    name = "Augustus"
    age = "14"
    location = "Uganda High Commission, Nairobi, Kenya"
    phone = "254204445420"
    issue = "No braille access at work"
    condtype = "Visually impaired, wheelchair" '''

    # Parse then inject into database
def inject(text):
    # Connect to local MySQL database on AWS EC2
    db = mdb.connect('127.0.0.1','root','jpmorgan','codeforgood')
    # Prepare a cursor to traverse the database and get rows
    cursor = db.cursor()
    try:
        name, age, location, phone, issue, condtype = parse(text)
    except Exception as e:
        print "Some exception while parsing: "
        print e
        return
    query = "INSERT INTO codeforgood.data(name, age, location, phone, issues, condtype) VALUES(%s, %s, %s, %s, %s, %s);"
    # Inject into database with MySQL
    try:
        cursor.execute(query, [name, age, location, phone, issue, condtype])
    except Exception as e:
        print "Some exception while inserting: "
        print e
        return
    # Agree that the changes should be pushed/written to the database
    db.commit()
    # Friendly, re-assuring SUCCESS message
    print ">> SUCCESS: New data in DB"

# Always run as a main, never as a module
if __name__ == '__main__':
    print "Starting up..."
    fileHandling()
