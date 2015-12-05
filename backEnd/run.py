# -*- coding: utf-8 -*-
from flask import Flask
from getSQL import SQLObject
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
  return "sms"

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8888)
