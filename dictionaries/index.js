/*
 * gulp-spellcheck
 *
 * Copyright(c) 2014 André König <andre.koenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

var fs       = require('fs');
var path     = require('path');
var Hunspell = require('nodehun');

var dictionaries = {
    en_US: {
        aff: fs.readFileSync(path.join(__dirname, 'en_US', 'en_US.aff')),
        dic: fs.readFileSync(path.join(__dirname, 'en_US', 'en_US.dic'))
    },
    de_DE: {
        aff: fs.readFileSync(path.join(__dirname, 'de_DE', 'de_DE.aff')),
        dic: fs.readFileSync(path.join(__dirname, 'de_DE', 'de_DE.dic'))
    }
};

/**
 * Finds a file in the given directory by a given extension.
 *
 * @param  {string} p The path to the files.
 * @param  {string} ext The extension of the searched file.
 *
 * @return {string} The absolute path of the respective file.
 *
 */
function find (p, ext) {
    var files = fs.readdirSync(p);
    var len = files.length;
    var i = 0;
    var file;

    for (i; i < len; i = i + 1) {
        file = files[i];

        if (('.' + ext) === path.extname(file)) {
            return path.join(p, file);
        }
    }
}

/**
 * Returns a dictionary of a given language OR
 * loads a directory by a given path.
 *
 * @param  {string} lang The ISO 639 or ISO 3166 language code OR the path to the dictionary.
 *
 * @return {object|null} The dictionary.
 *
 */
exports.get = function (lang) {
    var dictionary = null;

    if (dictionaries[lang]) {
        dictionary = dictionaries[lang];
    } else {
        try {
            dictionary = {
                aff: fs.readFileSync(find(lang, 'aff')),
                dic: fs.readFileSync(find(lang, 'dic'))
            };
        } catch (e) {
            return null;
        }
    }

    return new Hunspell(dictionary.aff, dictionary.dic);
};