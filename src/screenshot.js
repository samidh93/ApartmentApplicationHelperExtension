// screenshot.js
'use strict';

import screenshotDesktop from '../../node_modules/screenshot-desktop';
import fs from '../../node_modules/fs';

async function takeScreenshot(outputPath) {
    try {
        // Capture a screenshot in PNG format
        const img = await screenshotDesktop({ format: 'png' });

        // Write the screenshot to the specified output path
        fs.writeFileSync(outputPath, img);
        console.log('Screenshot saved:', outputPath);
        return true;
    } catch (error) {
        // Handle errors that occur during screenshot capture
        console.error('Error taking screenshot:', error);
        return false;
    }
}

//export { takeScreenshot };
module.exports = {
    takeScreenshot
  };