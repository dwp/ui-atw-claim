const {
  task,
  src,
  dest,
  series,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const assetsPath = './static/';
const pathToGovFrontend = './node_modules/govuk-frontend-v5/dist/govuk';
const pathToNhsFrontend = './node_modules/nhsuk-frontend/dist';

// -------- Assets
task('build-assets-sass', () => src(['app/assets/sass/*.scss'])
  .pipe(sass
    .sync()
    .on('error', sass.logError))
  .pipe(dest(`${assetsPath}/css`)));

task('build-govuk-js', () => src([`${pathToGovFrontend}/all.bundle.js`])
  .pipe(dest(`${assetsPath}/js`)));

task('build-nhs-js', () => src([`${pathToNhsFrontend}/nhsuk-*.min.js`])
  .pipe(rename('nhsuk.js'))
  .pipe(dest(`${assetsPath}/js`)));

task('build-assets', () => src([`${pathToGovFrontend}/assets/**/*`])
  .pipe(dest(`${assetsPath}/assets`)));

task('build-project-js', () => src(['./app/assets/js/*.js'])
  .pipe(uglify())
  .pipe(dest(`${assetsPath}/js`)));

task('build-project-js-bundle', () => {
  const filesToBundle = [
    './app/assets/js/time-out.js',
    './app/assets/js/govuk-support.js'
  ];
  return browserify([...filesToBundle])
    .transform(babelify, {
      presets: ['@babel/preset-env'],
      sourceMaps: true,
      global: true,
      ignore: [/\/node_modules\/(?!hmrc-frontend\/)/],
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest(`${assetsPath}/js`));
});

// --- Series
task('build', series(['build-assets-sass', 'build-nhs-js', 'build-assets', 'build-govuk-js', 'build-project-js', 'build-project-js-bundle']));
