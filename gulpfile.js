const gulp = require('gulp');
const stylus = require('gulp-stylus');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');
const gulpLoadPlugins = require('gulp-load-plugins');
const mainBowerFiles = require('main-bower-files');
const through2 = require('through2').obj;


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Optimize images
gulp.task('images', () =>
    gulp.src('app/img/**/*')
        .pipe($.newer('dist/img'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'))
);

//clean all
gulp.task('clean', () => del(['dist/*', '!dist/.git'], {dot: true}));

gulp.task('bowerfiles', () => {
    return gulp.src(mainBowerFiles())
        .pipe($.if('*.{css,gif}', gulp.dest('./dist/css')))
        .pipe($.if('*.js', gulp.dest('./dist/js')))
        .pipe($.if('*.{eot,svg,ttf,woff}', gulp.dest('./dist/css/fonts')))
});

//copy html files
gulp.task('copy:html', () => {
    gulp.src(['./app/*', './app/*.html'])
        .pipe($.newer('./dist'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:fonts', () => {
    return gulp.src(['./app/fonts/**/*'])
        .pipe($.newer('./dist/fonts'))
        .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('copy:mail', () => {
    gulp.src(['./app/mail/**/*'])
        .pipe(gulp.dest('./dist/mail'));
})

gulp.task('styles', () => {
    gulp.src(['./app/css/*.styl', './app/css/*.css'])
        .pipe($.newer('./dist/css'))
        .pipe(plumber())
        .pipe($.if('*.styl', $.stylus()))
        .pipe($.if(!isDevelopment, $.autoprefixer({ browsers: ['> 5%'] })))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
    gulp.src(['./app/js/*.js'])
        .pipe($.sourcemaps.init())
        .pipe(plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.concat('main.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
});





gulp.task('serve', ['default'], () => {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        scrollElementMapping: ['main', '.mdl-layout'],
        // https: true,
        server: './dist',
        port: 3000
    });

    gulp.watch(['app/**/*.html'], ['copy:html', reload]);
    gulp.watch(['app/css/**/*.{styl,css}'], ['styles']);
    gulp.watch(['app/js/**/*.js'], ['scripts', reload]);
    gulp.watch(['app/img/**/*'], ['images', reload]);
});

gulp.task('default', ['clean'], cb =>
    runSequence(
        'styles',
        ['scripts', 'images', 'copy:html', 'copy:fonts', 'copy:mail', 'bowerfiles'],
        cb
    )
);


gulp.task('images:envato', () => {
    gulp.src('app/img/**/*')
        .pipe($.jimp({
            "": {
                blur: 40
            }
        }))
        .pipe(gulp.dest('dist/img'));
});


/*Upload in the server task*/
gulp.task('upload:prepare', function () {
    return gulp.src('app/*.html')
        .pipe($.useref({ searchPath: './dist' }))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cleanCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('upload:sftp', () => {
    gulp.src('dist/**/*')
        .pipe($.sftp({
            host: '195.54.162.42',
            user: 'admin',
            pass: '30143014ad',
            remotePath: "/home/admin/web/dexifly.com/public_html/batter/"
        }));
});

gulp.task('upload', ['default'], cb =>
    runSequence(
        'upload:prepare',
        ['upload:sftp'],
        cb
    )
);