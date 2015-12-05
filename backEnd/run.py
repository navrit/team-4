from flask import Flask
app = Flask(__name__)

@app.route("/query")
def query():
  return "query"

@app.route("/")
def start():
  return "Hello World!"

@app.route('/query', methods=['GET'])
def query():
  return "query"

@app.route('/sms', methods=['POST'])
def sms():
  return "sms"

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)
