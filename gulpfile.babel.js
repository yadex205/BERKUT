import gulp from 'gulp'
import ejs from 'gulp-ejs'
import sass from 'gulp-sass'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import livereload from 'gulp-livereload'
import concat from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'
import electron from 'electron-prebuilt'
import rimraf from 'rimraf'

var spawn = require('child_process').spawn

var targetDir = 'htdocs'
var plumberOptions = {
    errorHandler: notify.onError('Error <%= error.message %>')
}

gulp.task('default')

gulp.task('build', ['html', 'css', 'js'])

gulp.task('live', ['html_live', 'css', 'js'], () => {
    livereload.listen()
    let app = spawn(electron, ['.'])

    gulp.watch('src/html/**/*.ejs', ['html_live'])
    gulp.watch('src/css/**/*.scss', ['css'])
    gulp.watch('src/js/**/*.js', ['js'])

    app.on('close', () => {
        process.exit(1)
    })
})

gulp.task('clean', (callback) => {
    rimraf(targetDir, callback)
})

gulp.task('html', () => {
    gulp.src(['src/html/**/*.ejs', '!src/html/**/_*.ejs'])
        .pipe(plumber(plumberOptions))
        .pipe(ejs({
            isLive: false,
            blendTechniques: require('./etc/blend_techniques.json')
        }, {
            ext: '.html'
        }))
        .pipe(gulp.dest(targetDir))
        .pipe(livereload())
})

gulp.task('html_live', () => {
    gulp.src(['src/html/**/*.ejs', '!src/html/**/_*.ejs'])
        .pipe(plumber(plumberOptions))
        .pipe(ejs({
            isLive: true,
            blendTechniques: require('./etc/blend_techniques.json')
        }, {
            ext: '.html'
        }))
        .pipe(gulp.dest(targetDir))
        .pipe(livereload())
})

gulp.task('css', () => {
    gulp.src([
        'src/css/**/*.scss',
        'bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.css'])
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
        }))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${targetDir}/css`))
        .pipe(livereload())
})

gulp.task('js', () => {
    gulp.src([
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        'bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.js',
        'src/js/class/**/*.js',
        'src/js/*.js'])
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${targetDir}/js`))
        .pipe(livereload())
})
