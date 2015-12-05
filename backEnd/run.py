# -*- coding: utf-8 -*-
from flask import Flask
from getSQL import SQLObject
from twilio.rest import TwilioRestClient
import twilio.twiml
app = Flask(__name__)

@app.route("/")
def start():
  return "Hello World!"

@app.route('/query', methods=['GET'])
def query():
  f = open('example.json', 'r')
  return f.read()

@app.route('/queryfrom/<time>', methods=['GET'])
def queryfrom(time):
  query = 'SELECT * FROM codeforgood.data WHERE time > "%s"' % time
  sql = SQLObject(query)
  return str(sql.get())

@app.route('/sms', methods=['POST'])
def sms():
    # account credentials here
    ACCOUNT_SID = "AC7dc57255a855140dc9c2552589345e81"
    AUTH_TOKEN = "5376c083003cc2ba3e06b2d9ef9ea636"

    client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)

    messages = client.messages.list()

    print messages

    resp = twilio.twiml.Response()
    resp.message("Hello, Mobile Monkey")
    return str(resp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8888)
