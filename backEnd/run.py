from flask import Flask
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
  return time

@app.route('/sms', methods=['POST'])
def sms():
  return "sms"

@app.route('/example', methods=['GET'])
def example():
  f = open('example.json')
  return f.read()

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)
