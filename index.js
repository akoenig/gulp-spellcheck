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

var util        = require('util');
var through     = require('through2');
var aspell      = require('aspell');
var gutil       = require('gulp-util');
var PLUGIN_NAME = 'gulp-spellcheck';

module.exports = function (options) {

    //
    // Option normalization
    //
    options = options || {};
    options.replacement = options.replacement || '%s (suggestions: %s)';
    options.language    = (options.language)? util.format('--lang=%s', options.language) : '';

    //
    // GNU Aspell configuration
    //
    aspell.args.push(options.language);

    function check (file, enc, callback) {
        /*jshint validthis:true */
        var self = this;
        var contents = file.contents.toString('utf-8');

        // 
        // Remove all the control characters and pass the content to GNU Aspell.
        // 
        // see: http://aspell.net/man-html/Through-A-Pipe.html
        //
        // *word   Add a word to the personal dictionary
        // &word   Insert the all-lowercase version of the word in the personal dictionary
        // @word   Accept the word, but leave it out of the dictionary
        // #   Save the current personal dictionary
        // ~   Ignored for Ispell compatibility.
        // +   Enter TeX mode.
        // +mode   Enter the mode specified by mode.
        // -   Enter the default mode.
        // !   Enter terse mode
        // %   Exit terse mode
        // ^   Spell-check the rest of the line 
        //
        aspell(contents.replace(/(\*|\&|\@|\#|\~|\+|\-|\!|\%|\^)/g, ''))
            .on('error', function onError (err) {
                err = err.toString('utf-8');

                return self.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
            })
            .on('result', function onResult (result) {
                if ('misspelling' === result.type && result.alternatives.length) {
                    contents = contents.replace(result.word, util.format(options.replacement, result.word, result.alternatives.join(', ')));
                }
            })
            .on('end', function () {
                file.contents = new Buffer(contents);
                self.push(file);

                return callback();
            });
    }

    function suggest (callback) {
        return callback();
    }

    return through.obj(check, suggest);
};