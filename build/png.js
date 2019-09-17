/**
 * Convert SVG to PNG
 *
 * Important: this code uses Iconify Tools that rely on PhantomJS to generate PNG files.
 * Before running this script make sure you have PhantomJS installed.
 *
 * On OSX you can easily install PhantomJS with HomeBrew: brew install phantomjs
 *
 * Script will build only missing files. Add --overwrite to command line to rebuild all files.
 */
"use strict";

const fs = require('fs');
const path = require('path');
const tools = require('@iconify/tools');
const phantom = require('@iconify/tools/src/export/phantomjs');

const root = path.dirname(path.dirname(__filename));

// Change this directory to location of material-design-icons-updated package's root directory
// Default location of material-design-icons-updated is ../material-design-icons-updated
const sourceDir = path.dirname(root) + '/material-design-icons-updated';
const outputDir = root + '/png';

// Configuration
const colors = ['black', 'white'];
const sizes = [{
    size: 24,
    suffix: ''
}, {
    size: 48,
    suffix: '-2x'
}, {
    size: 96,
    suffix: '-4x'
}];

const queueLimit = colors.length * sizes.length * 5;

// Options
let overwrite = process.argv.length === 3 && process.argv.slice(2).indexOf('--overwrite') !== -1;

// Get data
const data = JSON.parse(fs.readFileSync(sourceDir + '/data.json', 'utf8'));

// Create directories
try {
    fs.mkdirSync(outputDir, 0o755);
} catch (err) {
}
colors.forEach(color => {
    try {
        fs.mkdirSync(outputDir + '/' + color, 0o755);
    } catch (err) {
    }
});

// Compose data
let icons = data.icons;
let queue = [];

/**
 * Check if file exists
 *
 * @param file
 * @return {boolean}
 */
let fileExists = file => {
    try {
        fs.statSync(file);
    } catch (e) {
        return false;
    }
    return true;
};

/**
 * Parse queue
 * @param callback
 */
let parseQueue = callback => {
    phantom(queue).then(() => {
        queue = [];
        callback();
    }).catch(err => {
        throw new Error(err);
    });
};

/**
 * Add item to queue
 *
 * @param item
 * @param callback
 */
let queueItem = (item, callback) => {
    queue.push(item);
    if (queue.length >= queueLimit) {
        parseQueue(callback);
    } else {
        callback();
    }
};

/**
 * Parse next set of icons
 */
let nextIconSet = () => {
    let icon = icons.shift();
    if (icon === void 0) {
        parseQueue(() => {
            console.log('Done.');
        });
        return;
    }
    let name = icon.name;

    // Create directories for all colors
    colors.forEach(color => {
        let dir = outputDir + '/' + color + '/' + name;
        try {
            fs.mkdirSync(dir, 0o755);
        } catch (err) {
        }
    });

    // Import all families for icon set
    tools.ImportDir(sourceDir + '/svg/' + name, {
        keywordCallback: key => key
    }).then(collection => {

        let themes = collection.keys();

        /**
         * Parse next icon
         */
        let nextIcon = () => {

            let theme = themes.shift();
            if (theme === void 0) {
                nextIconSet();
                return;
            }

            let logFile = name + '/' + theme;
            let svg = collection.items[theme];

            // Change palette
            tools.ChangePalette(svg, {
                default: 'currentColor',
                add: 'currentColor'
            }).then(() => {

                let colorsList = colors.slice(0);

                /**
                 * Parse next color
                 */
                let nextColor = () => {
                    let color = colorsList.shift();
                    if (color === void 0) {
                        // Parse queued data
                        nextIcon();
                        return;
                    }

                    let sizeList = sizes.slice(0);

                    /**
                     * Parse next size
                     */
                    let nextSize = () => {
                        let size = sizeList.shift();
                        if (size === void 0) {
                            nextColor();
                            return;
                        }

                        // Get file name, check if file already exists
                        let file = color + '/' + name + '/' + theme + size.suffix + '.png';
                        if (!overwrite && fileExists(outputDir + '/' + file)) {
                            nextSize();
                            return;
                        }

                        // Log export
                        if (logFile) {
                            console.log('Exporting', logFile);
                            logFile = null;
                        }

                        // Export icon
                        tools.ExportPNG(svg, outputDir + '/' + file, {
                            height: size.size,
                            color: color,
                            parse: false
                        }).then(row => {
                            queueItem(row, () => {
                                nextSize();
                            });
                        }).catch(err => {
                            reject(err);
                        })
                    };
                    nextSize();
                };

                nextColor();

            }).catch(err => {
                reject(err);
            });
        };

        nextIcon();

    }).catch(err => {
        throw new Error(err);
    });

};

nextIconSet();
