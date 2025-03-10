# Flask-Server für lokales Testen mit CORS-Proxy-Funktionalität
from flask import Flask, send_from_directory, request, jsonify
import os
import requests
from flask_cors import CORS

app = Flask(__name__, static_folder='dist')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

# CORS-Proxy endpoint for development
@app.route('/proxy', methods=['POST'])
def proxy():
    data = request.json
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    target_url = data['url']
    print(f"Proxying request to: {target_url}")
    
    try:
        # Forward the request to the target URL
        response = requests.get(
            target_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml'
            },
            timeout=10
        )
        
        # Return the response content
        return jsonify({
            'content': response.text,
            'status': response.status_code
        })
    except Exception as e:
        print(f"Proxy error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("DEVmatrose Server läuft auf http://localhost:5000")
    print("CORS-Proxy verfügbar unter http://localhost:5000/proxy")
    app.run(debug=True, host='0.0.0.0', port=5000)