const { join } = require('path');
const fs = require('fs');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((v) => v.name !== 'en')
    .map((dirent) => dirent.name);

const getDeepKeys = (obj) => {
  let keys = [];
  for (const key in obj) {
    keys.push(key);
    if (typeof obj[key] === 'object') {
      const subkeys = getDeepKeys(obj[key]);
      keys = keys.concat(subkeys.map((subkey) => `${key}.${subkey}`));
    }
  }
  return keys;
};

const fullPath = join(__dirname, './en');
const languages = getDirectories('./src/locale');

fs.readdir(fullPath, (error, files) => {
  if (error) console.log(error);
  files.forEach((file) => {
    const mainJson = JSON.parse(
      fs.readFileSync(join(fullPath, file)).toString()
    );
    languages.forEach((lang) => {
      const fullPathLanguage = join(__dirname, `./${lang}`);
      const comparedJson = JSON.parse(
        fs.readFileSync(join(fullPathLanguage, file)).toString()
      );

      const a = getDeepKeys(mainJson);
      const b = getDeepKeys(comparedJson);

      if (a.sort().length !== b.sort().length) {
        const missing = a.filter((item) => b.indexOf(item) < 0);
        throw new Error(
          `Missing the following keys from locale "${lang}", file: "${file}":\n"${missing}".`
        );
      }
    });
  });
});
