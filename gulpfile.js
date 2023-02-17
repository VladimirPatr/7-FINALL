import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import gulpCssimport from 'gulp-cssimport';
import del from 'del';
import htmlmin from 'gulp-htmlmin';
import cleanCss from 'gulp-clean-css';
import terser from 'gulp-terser';
import sourcemaps from 'gulp-sourcemaps';
import gulpImg from 'gulp-image';
import gulpWebp from 'gulp-webp';
import gulpAvif from 'gulp-avif';
import {stream as critical} from 'critical';
import gulpif from 'gulp-if';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';

const prepros = true;

let dev = false;

const sass = gulpSass(sassPkg);

export const html = () => gulp
.src('src/*.html')
.pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
}))
.pipe(gulp.dest('dist'))
.pipe(browserSync.stream());

export const style = () => {
    if (prepros) {
        return gulp
        .src('src/scss/**/*.scss')
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCss({
            2: {
                specialComments: 0
            }
        }
        ))
        .pipe(gulpif(dev, sourcemaps.write('../maps')))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
    }
    return gulp
    .src('src/css/style.css')
    .pipe(gulpif(dev,sourcemaps.init()))
    .pipe(gulpCssimport({
        extensions: ['css'],
    }))
    .pipe(autoprefixer())
    .pipe(cleanCss({
        2: {
            specialComments: 0
        }
    }
    ))
    .pipe(gulpif(dev,sourcemaps.write('../maps')))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

export const js = () => gulp
.src('src/js/**/*.js')
.pipe(gulpif(dev,sourcemaps.init()))
// .pipe(babel({
//     presets: ['@babel/preset-env'],
//     ignore: ['src/js/**/*.min.js']
// }))
.pipe(terser())
.pipe(gulpif(dev,sourcemaps.write('../maps')))
.pipe(gulp.dest('dist/js'))
.pipe(browserSync.stream());

export const img = () => gulp
.src('src/img/**/*.{jpg,jpeg,png,svg,gif}')
.pipe(gulpif(!dev, gulpImg(
    {
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        // concurrent: 10,
        // quiet: true // defaults to false
      }
)))
.pipe(gulp.dest('dist/img'))
.pipe(browserSync.stream());


export const webp = () => gulp
.src('src/img/**/*.{jpg,jpeg,png}')
.pipe(gulpWebp(
    {
        quality: 60
      }
))
.pipe(gulp.dest('dist/img'))
.pipe(browserSync.stream());

export const avif = () => gulp
.src('src/img/**/*.{jpg,jpeg,png}')
.pipe(gulpAvif(
    {
        quality: 50
      }
))
.pipe(gulp.dest('dist/img'))
.pipe(browserSync.stream());

export const critCss = () => gulp
        .src('dist/*.html')
        .pipe(critical({
            base: 'dist/',
            inline: true,
            css: ['dist/css/style.css']
        }))
        .on('error', err => {
            console.error(err.messege)
        })
        .pipe(gulp.dest('dist'))

export const copy = () => gulp
.src(
    'src/fonts/**/*', {
    base: 'src'
})
.pipe(gulp.dest('dist'))
.pipe(browserSync.stream({
    once: true
}));

export const server = () => {
    browserSync.init({
        ui: false,
        notify: false, 
        // tunnel: true,
        server: {
            baseDir: 'dist'
        }
    })

    gulp.watch('./src/**/*.html', html);
    gulp.watch(prepros? './src/scss/**/*.scss':'./src/css/**/*.css', style);
    gulp.watch('src/img/**/*.{jpg,jpeg,png,svg,gif}', img);
    gulp.watch('./src/**/*.js', js);
    gulp.watch('src/fonts/**/*', copy);
    gulp.watch('src/img/**/*.{jpg,jpeg,png}', webp);
    gulp.watch('src/img/**/*.{jpg,jpeg,png}', avif);
};

export const clear = () => del('dist/**/*', {forse: true,});

// запуск
export const develop = async()=> {
    dev = true;
}

export const base = gulp.parallel(html, style, js, img, webp, avif, copy);

export const build = gulp.series(clear, base, critCss);

export default gulp.series(develop, base, server);

