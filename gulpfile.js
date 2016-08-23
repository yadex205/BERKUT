const gulp = require('gulp')
const ejs = require('gulp-ejs')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const plumberOption = {
    errorHandler: notify.onError('Error: <%= error.message %>')
}
const ejsSetting = { ext: '.html' }

gulp.task('default')

gulp.task('watch', ['html'], () => {
    gulp.watch('app/view/**/*.ejs', ['html'])
})

gulp.task('html', () => {
    gulp.src(['app/view/**/*.ejs', '!app/view/**/_*.ejs'])
        .pipe(plumber(plumberOption))
        .pipe(ejs({}, ejsSetting))
        .pipe(gulp.dest('htdocs'))
})