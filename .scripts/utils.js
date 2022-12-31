// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const fs = require('fs');

const localeDir = path.join(__dirname, '..', 'src', 'locale');

// get all language paths to re-order
const languages = fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

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

module.exports = { localeDir, languages, orderKeys };