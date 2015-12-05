from twilio.rest import TwilioRestClient
import MySQLdb as mdb
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
    		break

    writer = open("messageSID.txt", "w") # Update our now out of date messages list.

    for m in messages:
    	writer.write(m.sid)
    	writer.write("\n")

    writer.close()

def parse(text):
    # PARSE IT WITH REGEX >> ars;23;Uganda..... --> Name:ars Age:23 Location:Uganda
    
    dataList = re.split(r';{1,}', text) #Puts text into a list where each element is seperated by ;
    dataList = [re.sub(r'\n', ' ', attributes) for attributes in dataList] #Gets rid of unwanted newline chars.

    name = dataList[0]
    age = dataList[1]
    location= dataList[2]
    phone = dataList[3]
    issue = dataList[4]
    condtype = dataList[5]
    return name, age, location, phone, issue, condtype

def unpack(a, b, c, d, e, f, *rest):
  return a, b, c, d, e, f, rest

def inject(text):
    db = mdb.connect('127.0.0.1','root','jpmorgan','codeforgood')
    cursor = db.cursor()
    # Parse then inject into database
    print text
    try:
      name, age, location, phone, issue, condtype = parse(text)
    except Exception as e:
      print "Exception while parsing"
      print e
      return
    ''' SAMPLE DATA
    name = "Augustus"
    age = "14"
    location = "Uganda High Commission, Nairobi, Kenya"
    phone = "254204445420"
    issue = "No braille access at work"
    condtype = "Visually impaired, wheelchair" '''
    # Inject into database
    query = "INSERT INTO codeforgood.data(name, age, location, phone, issues, condtype) VALUES(%s, %s, %s, %s, %s, %s);"
    try:
      cursor.execute(query, [name, age, location, phone, issue, condtype])
    except Exception as e:
      print "Exception while inserting"
      print e
      return
    db.commit()
    print ">> SUCCESS: New data in DB"

if __name__ == '__main__':
  print "running"
  fileHandling()
