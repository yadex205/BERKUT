const gulp = require('gulp')
const ejs = require('gulp-ejs')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const plumberOption = {
    errorHandler: notify.onError('Error: <%= error.message %>')
}
const ejsSetting = { ext: '.html' }

gulp.task('default')

gulp.task('watch', ['html'], () => {
    gulp.watch('app/views/**/*.ejs', ['html'])
})

gulp.task('html', () => {
    gulp.src(['app/views/**/*.ejs', '!app/view/**/_*.ejs'])
        .pipe(plumber(plumberOption))
        .pipe(sourcemaps.init())
        .pipe(ejs({}, ejsSetting))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('htdocs'))
})

gulp.task('css', () => {
    gulp.src('app/assets/styles/**/*.s+(a|c)ss')
        .pipe(plumber(plumberOption))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('htdocs/assets/styles'))
})