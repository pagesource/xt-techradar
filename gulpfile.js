const gulp = require('gulp');
const map = require('map-stream');
const RadarMarkdownParser = require('./utils/parser');
const gulpSequence = require('gulp-sequence');
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
            contents: new Buffer(string)
        }));
        this.push(null);
    };
    return src;
}

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('build', function () {
    return gulp.src(['./src/docs/*.md'])
        .pipe(map(function (file, done) {
            data.push(new RadarMarkdownParser(file.contents.toString('utf8'), path.basename(file.path)));
            done();
        }))
        .pipe(gulp.dest('./dist/temp'));
});

gulp.task('write', function () {
    return string_src('output.json', JSON.stringify(data, null, 2))
        .pipe(gulp.dest('dist/data'));
});


gulp.task('minify-css', () => {
    return gulp.src('dist/index.html')
        .pipe(inline({
            css: [cleanCSS],
            disabledTypes: ['js', 'img', 'svg']
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('md', gulpSequence('clean', 'build', 'write'));