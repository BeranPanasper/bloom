
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert');

gulp.task('preloader', function() {
    gulp.src([
            'src/namespace.js',
            'src/base/*.js',
            'src/preloader/*.js',
            'src/preloader/**/*.js'
        ])
        .pipe(concat('bloom-preloader.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('framework', function() {
    gulp.src([
            'src/framework/*.js',
            'src/framework/**/*.js'
        ])
        .pipe(concat('bloom-framework.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('all', ['preloader', 'framework']);

gulp.task('default', ['all'], function() {
    gulp.watch([
        'src/*.js',
        'src/**/*.js'
    ], ['all']);
});
