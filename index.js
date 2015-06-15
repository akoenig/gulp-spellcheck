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
    options.mode = (options.mode)? util.format('--mode=%s', options.mode) : '';

    aspell.args.push(options.language);
    aspell.args.push(options.mode);

    function check (file, enc, callback) {
        /*jshint validthis:true */
        var self = this;
        var contents = file.contents.toString('utf-8');

        // Remove all line breaks and add a circumflex in order to disable 'pipe mode'.
        // see: http://aspell.net/man-html/Through-A-Pipe.html
        var line = 1;
        aspell((options.ignore || []).map(function(str) { return util.format("@%s\n", str); }).join("") + '^' + contents.replace(/\r?\n/g, '^\n'))
            .on('error', function onError (err) {
                err = err.toString('utf-8');

                return self.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
            })
            .on('result', function onResult (result) {
                if ('misspelling' === result.type) {
                    if (options.stdout) {
                        gutil.log(gutil.colors.red("Misspelling:"),
                            file.relative,
                            util.format("Line %s, Column %s", line, result.position + 1),
                            util.format(options.replacement, gutil.colors.red.bold(result.word), result.alternatives.join(', ')));
                    } else {
                        contents = contents.replace(result.word, util.format(options.replacement, result.word, result.alternatives.join(', ')));
                    }
                } else if ('line-break' === result.type) {
                    line++;
                }
            })
            .on('end', function () {
                if (!options.stdout) {
                    file.contents = new Buffer(contents);
                }
                self.push(file);

                return callback();
            });
    }

    function finalize (callback) {
        return callback();
    }

    return through.obj(check, finalize);
};