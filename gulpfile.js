const {src , dest, series} = require('gulp');
const bufferFrom = require('buffer-from');
const map = require('map-stream');
const RadarMarkdownParser = require('./utils/parser');
const cleanCSS = require('gulp-clean-css');
const inline = require('gulp-inline');
const path = require('path');
const del = require('del');
const Vinyl = require('vinyl');
const data = [];

// Thanks to https://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp/24451738
function string_src(filename, string) {
    const src = require('stream').Readable({
        objectMode: true
    });
    src._read = function () {
        this.push(new Vinyl({
            cwd: process.cwd(),
            base: './',
            path: filename,
            contents: bufferFrom(string)
        }));
        this.push(null);
    };
    return src;
}


// Updated gulp API functions

// Clean dist folder
function clean () {
    return del(['dist']);
}
exports.clean = clean;

// Build docs
function build () {
    return src(['./src/docs/*.md'])
        .pipe(map(function (file, done) {
            data.push(new RadarMarkdownParser(file.contents.toString('utf8'), path.basename(file.path)));
            done();
        }))
        .pipe(dest('./dist/temp'));
}

exports.build = build;
// Wrire output
function write() {
    return string_src('output.json', JSON.stringify(data, null, 2))
        .pipe(dest('dist/data'));
}
exports.write = write;

// Minify CSS
function minifyCss(){
    return src('dist/index.html')
        .pipe(inline({
            css: [cleanCSS],
            disabledTypes: ['js', 'img', 'svg']
        }))
        .pipe(dest('dist/'));
}
exports.minifyCss = minifyCss;

// Build output
exports.md = series(clean, build, write);