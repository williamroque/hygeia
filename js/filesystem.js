const path = require('path');
const fs = require('fs');

const Module = require('./module');

class System {
    constructor(systemPath) {
        this.systemPath = systemPath;
    }

    parseModules() {
        const modulePaths = fs.readdirSync(
            path.join(this.systemPath, 'modules')
        ).map(modulePath => path.join(this.systemPath, 'modules', modulePath));

        let modules = [];

        modulePaths.forEach(modulePath => {
            if (fs.existsSync(path.join(modulePath, 'manifest.json'))) {
                modules.push(new Module(modulePath));
            }
        });

        return modules;
    }
}

module.exports = System;
