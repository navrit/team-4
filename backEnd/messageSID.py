from twilio.rest import TwilioRestClient 
 
# account credentials here 
ACCOUNT_SID = "AC7dc57255a855140dc9c2552589345e81" 
AUTH_TOKEN = "5376c083003cc2ba3e06b2d9ef9ea636" 
 
client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN) 
 
messages = client.messages.list() 

#Open filestream to current messagesSID.txt file.
oldSID = open("messageSID.txt", "r")

firstSID = oldSID.readline()

#Iterate through twilio's list of messageSIDs.
for newSID in messages:
	if((newSID.sid+"\n") != firstSID):#If there's a new one, print it
		print newSID.body
	else:
		break


writer = open("messageSID.txt", "w") #Update our now out of date messages list.

for m in messages: 
	writer.write(m.sid)
	writer.write("\n")

writer.close()