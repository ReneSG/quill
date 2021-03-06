require('dotenv').load({silent: true});

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var environment = process.env.NODE_ENV;

var nodemon = require('gulp-nodemon');

function swallowError (error) {
    //If you want details of the error in the console
    console.log(error.toString());
    this.emit('end');
}

gulp.task('default', function(){
  console.log('yo. use gulp watch or something');
});

const js = function () {
  if (environment !== 'dev'){
    // Minify for non-development
    return gulp.src(['app/client/src/**/*.js', 'app/client/views/**/*.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .on('error', swallowError)
      .pipe(uglify())
      .pipe(gulp.dest('app/client/build'))
      
  } else {
    return gulp.src(['app/client/src/**/*.js', 'app/client/views/**/*.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .on('error', swallowError)
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('app/client/build'));
  }

}
gulp.task('js', js);

const sassF = function () {
  return gulp.src('app/client/stylesheets/site.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifyCss())
    .pipe(gulp.dest('app/client/build'));
}
gulp.task('sass', sassF);

gulp.task('build', gulp.series('js', 'sass', function(done){
  // Yup, build the js and sass.
  done()
}));

gulp.task('watch', gulp.parallel('js', 'sass', function () {
  gulp
    .watch('app/client/src/**/*.js', js);
  gulp
    .watch('app/client/views/**/*.js', js);
  gulp
    .watch('app/client/stylesheets/**/*.scss', sassF);
}));

gulp.task('server', gulp.parallel('watch', function(cb){
  let started = false;
  return nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': process.env.NODE_ENV || 'DEV' },
    watch: [
      'app/server'
    ]
  }).on('start', () => {
    if(!started) {
      cb();
      started = true;
    }
  });
}));
