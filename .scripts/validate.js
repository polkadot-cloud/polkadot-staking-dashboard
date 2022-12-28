const { join } = require('path');
const fs = require('fs');

// const oneExp = new RegExp('^.+_one$');
const otherExp = new RegExp('^.+_other$');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((v) => v.name !== 'en')
    .map((dirent) => dirent.name);

const getDeepKeys = (obj) => {
  let keys = [];
  for (const key in obj) {
    if (!otherExp.test(key)) {
      keys.push(key);
    }
    if (typeof obj[key] === 'object') {
      const subkeys = getDeepKeys(obj[key]);
      keys = keys.concat(subkeys.map((subkey) => `${key}.${subkey}`));
    }
  }
  return keys;
};

const enPath = join(__dirname, './en');
const otherLanguages = getDirectories('./src/locale');

fs.readdir(enPath, (error, files) => {
  if (error) console.log(error);
  files.forEach((file) => {
    const enJson = JSON.parse(fs.readFileSync(join(enPath, file)).toString());
    otherLanguages.forEach((lang) => {
      const languageFullPath = join(__dirname, `./${lang}`);
      const comparedJson = JSON.parse(
        fs.readFileSync(join(languageFullPath, file)).toString()
      );

      const en = getDeepKeys(enJson).sort();
      const lng = getDeepKeys(comparedJson).sort();

      // console.log(en[0]);
      // fs.writeFile(join(enPath, file), en.indexOf(file), function (err) {
      //     if (err) { console.err(err); }
      //     console.log(`----------Keys In ${lang}/${file} Are Ordered Alphabetically-------------`);
      // })

      if (en.length !== lng.length) {
        const missing = lng.filter((item) => en.indexOf(item) < 0);
        if (missing.join('').trim().length > 0) {
          console.log(
            `File "${file}" In "${lang}" Is Missing The Following "${missing.length}" Keys:`
          );
          console.log(missing);
        }
      }
    });
  });
});
