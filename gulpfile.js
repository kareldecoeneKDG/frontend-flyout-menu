const {src, dest, series, parallel, watch} = require('gulp');

// Extra functions for gulp
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Define the origin and destination where your files travel
const origin = 'src';
const destination = 'build';

// Define the sass compiler (default one)
sass.compiler = require('node-sass');

// Delete build map every time gulp command is called
async function clean(cb) {
    await del(destination);
    cb();
}

function html(cb) {
    src(`${origin}/*.html`).pipe(dest(destination));
    cb();
}

function css(cb) {
    src(`${origin}/css/style.scss`)
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    
    .pipe(dest(`${destination}/css`));

    cb();
}

function js(cb) {
    src(`${origin}/js/*.js`).pipe(dest(`${destination}/js`));
    cb();
}

// Watch certain folders on changes and act on it by calling the right function
function watcher(cb) {
    watch(`${origin}/*.html`).on('change', series(html, browserSync.reload))
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload))
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
    cb();
}

// Use browserSync to refresh browser on changes more easily
function server(cb) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: destination
        }
    })
    cb();
}

// Define basic "gulp" command with more functions
exports.default = series(clean, parallel(html, css, js), server, watcher);