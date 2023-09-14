// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const { getDirectories, localeDir, orderJsonByKeys } = require('./utils.cjs');

// Get all language paths to re-order.
const languages = getDirectories(localeDir, []);

// Gor each language path.
for (const lng of languages) {
  const pathToLanguage = path.join(localeDir, `/${lng}`);

  fs.readdir(pathToLanguage, (error, files) => {
    if (error) return;

    files.forEach(async (file) => {
      const pathToFile = path.join(pathToLanguage, file);
      const json = JSON.parse(fs.readFileSync(pathToFile).toString());

      // order json object alphabetically.
      const orderedJson = orderJsonByKeys(json);

      // format json object.
      const formatted = await prettier.format(JSON.stringify(orderedJson), {
        parser: 'json',
      });

      fs.writeFile(pathToFile, formatted, (err) => {
        if (err) {
          console.err(err);
        } else {
          console.log(
            `----------Keys In ${pathToLanguage}/${file} Are Ordered Alphabetically-------------`
          );
        }
      });
    });
  });
}
