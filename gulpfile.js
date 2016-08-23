const gulp = require('gulp')
const ejs = require('gulp-ejs')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const livereload = require('gulp-livereload')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const log = require('gulp-util').log

const electron = require('electron')
const spawn = require('child_process').spawn

const plumberOption = {
    errorHandler: notify.onError('Error: <%= error.message %>')
}
const ejsSetting = { ext: '.html' }

let isReload = false
let appProcess = null

gulp.task('default')

gulp.task('live', ['html', 'css', 'electron'], () => {
    livereload.listen()
    gulp.watch('app/views/**/*.ejs', ['html'])
    gulp.watch('app/assets/styles/**/*.s+(a|c)ss', ['css'])
    gulp.watch('lib/**/*.js', () => { livereload() })
    gulp.watch('index.js', () => {
        isReload = true
        appProcess.kill()
    })
})

gulp.task('electron', () => {
    const createApp = () => {
        const app = spawn(electron, ['.'])
        app.stdout.on('data', (buffer) => { log(buffer.toString()) })
        app.stderr.on('data', (buffer) => { log(buffer.toString()) })
        app.on('close', () => {
            if (!isReload) { process.exit(1) } else {
                isReload = false
                appProcess = createApp()
            }
        })
        return app
    }
    appProcess = createApp()
})

gulp.task('html', () => {
    return gulp.src(['app/views/**/*.ejs', '!app/view/**/_*.ejs'])
        .pipe(plumber(plumberOption))
        .pipe(sourcemaps.init())
        .pipe(ejs({}, ejsSetting))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('htdocs'))
        .pipe(livereload())
})

gulp.task('css', () => {
    return gulp.src('app/assets/styles/**/*.s+(a|c)ss')
        .pipe(plumber(plumberOption))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('htdocs/assets/styles'))
        .pipe(livereload())
})