"use strict";

const path = require('path');
const rootDir = path.dirname(path.dirname(__dirname));

let config = {
    // List of colors. Key = directory name, value = color
    colors: {
        black: '#000',
        white: '#fff'
    },

    // List of sizes in pixels
    sizes: [{
        size: 24,
        suffix: ''
    }, {
        size: 48,
        suffix: '-2x'
    }, {
        size: 96,
        suffix: '-4x'
    }],

    // Repository for SVG
    repo: 'git@github.com:material-icons/material-icons.git',

    // Directories
    rootDir: rootDir,
    outputDir: rootDir + '/png',
    repoDir: rootDir + '/material-icons'
};

module.exports = config;
