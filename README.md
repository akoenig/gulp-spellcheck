# gulp-spellcheck [![Build Status](https://travis-ci.org/akoenig/gulp-spellcheck.svg?branch=master)](https://travis-ci.org/akoenig/gulp-spellcheck)

> A gulp plugin for spell-checking with [GNU Aspell](http://aspell.net/).

## Usage

First of all you have to make sure that you have [GNU Aspell](http://aspell.net/) installed:
    
    $ # Debian-based
    $ sudo apt-get install aspell

If `aspell` is available install `gulp-spellcheck` as a development dependency in your project.

```shell
npm install --save-dev gulp-spellcheck
```

Then, add it to your `gulpfile.js`:

```javascript
var spellcheck = require('gulp-spellcheck');

gulp.task('spellcheck', function () {
    gulp.src('./dododo/**/*.md')
        .pipe(spellcheck())
        .pipe(gulp.dest('./spellchecked/'));
});
```

## API

### spellcheck (options)

#### options

##### language
Type: `String`
Default: undefined

ISO 639 or ISO 3166 language code (e.g. de). Please make sure that you have the respective aspell language pack installed (e.g. `sudo apt-get install aspell-de`).

##### replacement
Type: `String`
Default: '%s (suggestions: %s)'

The string that will replace the wrong word whereas the first placeholder is the wrong word and the second placeholder a list of suggestions.

##### stdout
Type: `Boolean`
Default: 'false'

Print spelling errors to stdout instead of altering the stream.

##### hideSuggestions
Type: `Boolean`
Default: 'false'

Hide suggestions when using stdout.

##### mode
Type: `String`
Default: 'none'

Choose aspell mode. See [GNU Aspell Documentation](http://aspell.net/man-html/Notes-on-Various-Filters-and-Filter-Modes.html#Notes-on-Various-Filters-and-Filter-Modes) for details.

##### ignore
Type: `Array` (of `Array`s)
Default: '[]'

List of words to be ignored.

## Changelog

### Version 0.2.0 (20150624)

- Added ignore list option
- Added options hideSuggestions, mode and stdout
- Improved output to include line and column number

### Version 0.1.2 (20140331)

- Added functionality for disabling 'pipe mode'.

### Version 0.1.1 (20140331)

- Fixed vinyl file access.

### Version 0.1.0 (20140331)

- Initial Release.

## Author

Copyright 2014, [André König](http://iam.andrekoenig.info) (andre.koenig@posteo.de)
