/**
 * Convert SVG to PNG
 *
 * Important: this code uses Iconify Tools that rely on PhantomJS to generate PNG files.
 * Before running this script make sure you have PhantomJS installed.
 *
 * On OSX you can easily install PhantomJS with HomeBrew: brew install phantomjs
 *
 * Script also requires newer Git than OSX provides. Install new Git with HomeBrew: brew install git
 *
 * Script will build only missing files. Add --overwrite to command line to rebuild all files.
 */
"use strict";

const clone = require('./src/clone');
const build = require('./src/build');

// Options
let overwrite = process.argv.length === 3 && process.argv.slice(2).indexOf('--overwrite') !== -1;

clone().then(() => {
    return build(overwrite);
}).then(() => {
    console.log('Done.');
}).catch(err => {
    console.error(err);
});
