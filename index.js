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

var util         = require('util');
var through      = require('through2');
var gutil        = require('gulp-util');
var dictionaries = require('./dictionaries/');
var PLUGIN_NAME  = 'gulp-spellcheck';

module.exports = function (options) {

    var dictionary;

    //
    // Option normalization
    //
    options = options || {};

    options.language = options.language || 'en_US';

    dictionary = dictionaries.get(options.language);

    if (!dictionary) {
        throw new gutil.PluginError(PLUGIN_NAME, 'No dictionary for "' + options.language + '" available.');
    }

    /**
     * Extracts all words out of a string.
     *
     * @param  {string} content The extractable content string.
     * @return {array} An array with all extracted words.
     *
     */
    function extractWords (content) {
        var len;
        var i = 0;
        var words = [];

        if (content instanceof Buffer) {
            content = content.toString('utf-8');
        }

        content = content.split(/\s+/);
        len = content.length;

        for (i; i < len; i = i + 1) {
            // Check if this is a real word
            if (content[i].match(/\w/g)) {
                words.push(content[i]);
            }
        }

        return words;
    }

    /**
     * Spell-checking of the files contents.
     *
     */
    function check (file, enc, callback) {
        /*jshint validthis:true */
        var self = this;
        var contents = file.contents.toString('utf-8');
        var words = extractWords(contents);
        var len = words.length;
        var i = 0;
        var checked = 0;
        var corrections = [];

        function handleSuggestion (word) {
            return function onSuggestion (correct, suggestions) {
                checked = checked + 1;

                if (!correct && suggestions.length) {
                    corrections.push(util.format('{%d} %s: %s', corrections.length, word, suggestions.join(', '));

                    contents = contents.replace(word, util.format('%s {%d}', word, corrections.length - 1));
                }

                if (checked === len) {
                    contents = contents + '\n\n' + corrections.join('\n');

                    file.contents = new Buffer(contents);
                    self.push(file);

                    return callback();
                }
            };
        }

        for (i; i < len; i = i + 1) {
            dictionary.spellSuggestions(words[i], handleSuggestion(words[i]));
        }
    }

    return through.obj(check);
};