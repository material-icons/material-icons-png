"use strict";

const fs = require('fs');
const path = require('path');
const tools = require('@iconify/tools');
const phantom = require('@iconify/tools/src/export/phantomjs');
const config = require('./config');
const fsHelper = require('./files');

module.exports = overwrite => new Promise((fulfill, reject) => {

    const sourceDir = config.repoDir;
    const outputDir = config.outputDir;

    const colorKeys = Object.keys(config.colors);
    const queueLimit = colorKeys.length * config.sizes.length * 5;

    // Get data
    const data = JSON.parse(fs.readFileSync(sourceDir + '/data.json', 'utf8'));

    // Create directories
    fsHelper.mkdir(colorKeys.map(color => outputDir + '/' + color));

    // Compose data
    let icons = data.icons;
    let queue = [];

    /**
     * Parse queue
     * @param callback
     */
    let parseQueue = callback => {
        phantom(queue).then(() => {
            queue = [];
            callback();
        }).catch(err => {
            reject(err);
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
                fulfill();
            });
            return;
        }
        let name = icon.name;

        // Create directories for all colors
        colorKeys.forEach(color => {
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

                    let colorsList = colorKeys.slice(0);

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
                        let colorValue = config.colors[color];

                        let sizeList = config.sizes.slice(0);

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
                            if (!overwrite && fsHelper.exists(outputDir + '/' + file)) {
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
                                color: colorValue,
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
            reject(err);
        });

    };

    nextIconSet();
});
