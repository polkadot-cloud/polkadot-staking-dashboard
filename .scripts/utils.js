const path = require('path');
const fs = require('fs');

const localeDir = path.join(__dirname, '..', 'src', 'locale');

const languages = fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);