# Optionaler Flask-Server für lokales Testen der Build-Version oder alternatives Deployment
# Verwendung: 
# 1. Installiere Flask: pip install flask
# 2. Führe den Server aus: python server.py
# 3. Öffne im Browser: http://localhost:5000

from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    print("DEVmatrose Server läuft auf http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)