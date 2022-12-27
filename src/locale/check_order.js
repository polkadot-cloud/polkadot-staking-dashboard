const fs = require('fs');
const { join } = require('path');


const enPath = join(__dirname, './en');
const languages = fs.readdirSync(__dirname, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

const orderKeys = () => {
    fs.readdir(enPath, (error, files) => {
        if (error) console.log(error);
        files.forEach((file) => {
            languages.forEach((lang) => {
                const languageFullPath = join(__dirname, `./${lang}`);
                const json = JSON.parse(
                    fs.readFileSync(join(languageFullPath, file)).toString()
                );
            })
        }
        );
    });
};

orderKeys()