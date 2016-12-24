const gulp = require('gulp');
const elm = require('gulp-elm');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const flatten = require('gulp-flatten');

gulp.task('default', [
	'Compile Elm',
	'Compile Sass',
	'Copy HTML'
]);

gulp.task('elm-init', elm.init);

gulp.task('Compile Elm', ['elm-init'], function(){
  return gulp.src('src/frontend/Main.elm')
    .pipe(elm())
		.pipe(uglify())
    .pipe(gulp.dest('build/'));
});

gulp.task('Compile Sass', _ => {
	return gulp.src('./src/frontend/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build'));
});

gulp.task('Copy HTML', _ => {
	return gulp.src('./src/frontend/index.html')
	.pipe(flatten())
	.pipe(gulp.dest('./build'));
});
