const gulp     = require('gulp');
const path     = require('path');
const rename   = require('gulp-rename');
const template = require('gulp-template');
const yargs    = require('yargs');

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join('src/app/components', parentPath, name);
  const blankTemplates = path.join(__dirname, 'generator', 'component/**/*.**');

  return gulp.src(blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});