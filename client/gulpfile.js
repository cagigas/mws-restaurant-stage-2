var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var eslint = require('gulp-eslint')
var concat = require('gulp-concat')
var browserSync = require('browser-sync').create()
var uglify = require('gulp-uglify')
const babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('webserver', function() {
  browserSync.init({
    server: './'
  })
})

gulp.task('styles', function() {
  return gulp.src('sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
})
gulp.task('copy-html', function() {
  return gulp.src('./*.html')
    .pipe(gulp.dest('dist'))
})
gulp.task('copy-images', function() {
  return gulp.src('img/*')
    .pipe(gulp.dest('dist/img'))
})
gulp.task('copy-data', function() {
  return gulp.src('data/*')
    .pipe(gulp.dest('dist/data'))
})
gulp.task('scripts', function() {
  return gulp.src('./js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    //.pipe(browserSync.stream())
})

//gulp.task('dist', gulp.series(['copy-html', 'copy-images', 'styles', 'lint', 'scripts']))


gulp.task('lint', function() {
  return gulp.src(['**/*.js','!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
})


gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('sass/**/*.scss', gulp.series(['styles'])).on('change', browserSync.reload)

  // Watch .js files
  gulp.watch('js/**/*.js', gulp.series(['lint']))

  // Watch image files
  gulp.watch('/index.html', gulp.series(['copy-html'])).on('change', browserSync.reload)
  //gulp.watch('img/*', gulp.series(['images']))

  browserSync.init({
    server: './dist'
  })


  // Watch any files in dist/, reload on change
//  gulp.watch([/*'css/**','js/**','img/**','*.html'*/'./index.html']).on('change', browserSync.reload)

})


gulp.task('default', gulp.series(['watch', /*'webserver',*/ 'copy-html', 'copy-images', 'styles', 'scripts']))
