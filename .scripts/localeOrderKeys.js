// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const { localeDir, languages, orderKeys } = require('./utils.js');

// for each language path
for (const lng of languages) {
  // concat lng to directory to get language path
  const pathToLanguage = path.join(localeDir, `/${lng}`);

  // open language directory & get files
  fs.readdir(pathToLanguage, (error, files) => {
    if (error) {
      return;
    }
    files.forEach((file) => {
      const pathToFile = path.join(pathToLanguage, file);

      // get file in raw JSOn
      const json = JSON.parse(fs.readFileSync(pathToFile).toString());

      // order json object alphabetically
      const orderedJson = orderKeys(json);

      // write the updated JSON as a string back into file.
      fs.writeFile(
        pathToFile,
        prettier.format(JSON.stringify(orderedJson), { parser: 'json' }),
        function (err) {
          if (err) {
            console.err(err);
          }
          console.log(
            `----------Keys In ${pathToLanguage}/${file} Are Ordered Alphabetically-------------`
          );
        }
      );
    });
  });
}
