const fs = require('fs');
const { join } = require('path');

const getDeepKeys = (obj) => {
    let keys = [];
    for (const key in obj) {
        keys.push(key);
        //在这把key【1】出来
        if (typeof obj[key] === 'object') {
            const subkeys = getDeepKeys(obj[key]);
            keys = keys.concat(subkeys.map((subkey) => `${key}.${subkey}`));
        }
    }
    return keys;
};

const enPath = join(__dirname, './en');
const languages = fs.readdirSync(__dirname, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

const isAlphabaticOrder = () => {
    fs.readdir(enPath, (error, files) => {
        if (error) console.log(error);
        files.forEach((file) => {
            languages.forEach((lang) => {
                const languageFullPath = join(__dirname, `./${lang}`);
                const json = JSON.parse(
                    fs.readFileSync(join(languageFullPath, file)).toString()
                );
                //这里要分开各个file的keys
                const keys = getDeepKeys(json);

                let l = keys.length;
                for (let i = 1; i < l; i++) {
                    // console.log(keys[i])
                    if (keys[i] < keys[i - 1]) {
                        return false;
                    }
                }
                return true;
            })
        }
        );
    });
};

if (isAlphabaticOrder()) { console.log("It is alphabaticlly ordered"); }
else { console.log("It is NOT alphabaticlly ordered") }