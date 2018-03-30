var gulp = require('gulp'),
    unglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    annotate = require('gulp-ng-annotate'),
    del = require('del'),
    ghPages = require('gulp-gh-pages'),
    webserver = require('gulp-webserver');

var src = {
    scripts: [
        './src/module.js',
        './src/metro.js',
        './src/metro-station.js',
        './src/metro-info.js',
        './src/metro-group.js'
    ],
    svg: [
        './src/metro-moscow.svg',
        './src/metro-spb.svg'
    ]
};

gulp.task('clean', function () {
    del(['./dist/*', './demo/*.js', './demo/*.svg'])
});

gulp.task('build', ['clean'], function () {

    gulp.src(src.scripts)
        .pipe(concat('dvhb_metro.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./demo'))
        .pipe(annotate())
        .pipe(unglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./demo'));

    gulp.src(src.svg)
        .pipe(gulp.dest('./demo'));

    gulp.src(src.svg)
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch([src.scripts, src.svg], ['build']);
});

gulp.task('ghPages', function () {
    return gulp.src('./demo/**/*')
        .pipe(ghPages({
            remoteUrl: 'git@github.com:dvhb/dvhb-metro.git'
        }));
});


gulp.task('webserver', function () {
    gulp.src('./demo')
        .pipe(webserver({
            host: '0.0.0.0',
            // livereload: true,
            open: false,
            port: 8000,
            fallback: './demo/index.html'
        }))
});

gulp.task('default', ['build', 'webserver', 'watch']);