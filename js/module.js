const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');


class Module {
    constructor(path) {
        this.path = path;

        this.manifest = {};

        this.readManifest();
    }

    readManifest() {
        this.manifest = JSON.parse(
            fs.readFileSync(
                path.join(this.path, 'manifest.json')
            )
        );
    }

    run(callback) {
        this.manifest.start = this.manifest.start.map(arg => {
            arg = arg.replace('{CWD}', this.path);

            return arg;
        });

        const [ command, ...args ] = this.manifest.start;

        this.subprocess = spawn(command, args);

        this.subprocess.stderr.on('data', err => {
            process.stderr.write(err.toString());
        });

        this.subprocess.stdout.on('data', data => {
            callback(JSON.parse(data));
        });
    }

    request(requestObj) {
        this.subprocess.stdin.write(
            JSON.stringify(requestObj) + '\r\n'
        );
    }

    close() {
        registrationModule.request({ command: 'close' });
    }
}


module.exports = Module;
