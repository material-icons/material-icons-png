"use strict";

const child_process = require('child_process');
const fsHelper = require('./files');
const config = require('./config');

module.exports = () => new Promise((fulfill, reject) => {
    let cmd = 'git clone "' + config.repo + '" --branch master --depth 1 --no-tags "' + config.repoDir + '"';

    // Remove old files
    fsHelper.cleanup(config.repoDir);

    // Clone repository
    console.log('Cloning ' + config.repo);
    child_process.exec(cmd, {
        cwd: config.rootDir,
        env: process.env,
        uid: process.getuid()
    }, (error, stdout, stderr) => {
        if (error) {
            reject('Error executing: ' + cmd + ': ' + error);
        } else {
            fulfill();
        }
    });
});
