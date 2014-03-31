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

    options = options || {};
    options.replacement = options.replacement || '%s (suggestions: %s)';

    options.language = (options.language)? util.format('--lang=%s', options.language) : '';

    aspell.args.push(options.language);

    function check (file, enc, callback) {
        /*jshint validthis:true */
        var self = this;
        var contents = file.contents.toString('utf-8');

        // Remove all line breaks and add a circumflex in order to disable 'pipe mode'.
        // see: http://aspell.net/man-html/Through-A-Pipe.html
        aspell('^' + contents.replace(/\r?\n/g, ''))
            .on('error', function onError (err) {
                err = err.toString('utf-8');

                return self.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
            })
            .on('result', function onResult (result) {
                if ('misspelling' === result.type) {
                    contents = contents.replace(result.word, util.format(options.replacement, result.word, result.alternatives.join(', ')));
                }
            })
            .on('end', function () {
                file.contents = new Buffer(contents);
                self.push(file);

                return callback();
            });
    }

    function finalize (callback) {
        return callback();
    }

    return through.obj(check, finalize);
};