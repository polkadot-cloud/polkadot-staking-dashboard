const path = require('path');
const fs = require('fs');

const localeDir = path.join(__dirname, '..', 'src', 'locale');

// get all language paths to re-order
const languages = fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

module.exports = { localeDir, languages };