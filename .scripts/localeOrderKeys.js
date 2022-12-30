const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const localeDir = path.join(__dirname, '..', 'src', 'locale');

// order keys of a json object.
const orderKeysAlphabetically = (o) => {
  const ordered = Object.keys(o)
    .sort()
    .reduce((obj, key) => {
      obj[key] = o[key];
      return obj;
    }, {});
  return ordered;
};

// check if value is an object. Do not count arrays as objects.
const isObject = (o) => {
  if (Array.isArray(o)) {
    return false;
  }
  if (typeof o === 'object') {
    return true;
  }
  return false;
};

// order keys of object
const orderKeys = (json) => {
  // order top level keys
  json = orderKeysAlphabetically(json);

  // order child objects if they are values.
  const jsonOrdered = {};
  Object.entries(json).forEach(([k, v]) => {
    if (isObject(v)) {
      jsonOrdered[k] = orderKeys(v);
    } else {
      jsonOrdered[k] = v;
    }
  });
  return jsonOrdered;
};

// get all language paths to re-order
const languages = fs
  .readdirSync(localeDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

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
