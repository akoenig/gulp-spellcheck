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

var fs         = require('fs');
var path       = require('path');
var spellcheck = require('../');
var gutil      = require('gulp-util');

describe('The "gulp-spellcheck" plugin', function () {

    it('should find wrong words', function (done) {
        var strom = spellcheck();
        var checked = '';

        strom.on('data', function (chunk) {
            checked = checked + chunk;
        });

        strom.on('end', function onEnd () {
            expect(checked.indexOf('suggestions')).not.toBe(-1);
            done();            
        });

        strom.write(fs.readFileSync(path.join(__dirname, 'checkable.md')));
        strom.end();
    });

    it('should return an error if the language is unknown', function (done) {
        var strom = spellcheck({
            language: 'unknownLanguage'
        });

        strom.on('error', function (err) {
            expect(err).toBeDefined();

            done();
        });

        strom.write(fs.readFileSync(path.join(__dirname, 'checkable.md')));
        strom.end();
    });
});