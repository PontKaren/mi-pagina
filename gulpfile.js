// gulpfile.js

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

// Rutas de los archivos
const paths = {
  scss: "./scss/**/*.scss",
  css: "./dist/css",
  html: "./**/*.html"
};

// 🔹 Compilar SCSS a CSS
function compileSass() {
  return gulp
    .src("./scss/style.scss")            // Archivo principal SCSS
    .pipe(sourcemaps.init())             // Inicia los mapas de fuente
    .pipe(sass().on("error", sass.logError)) // Compila el SCSS
    .pipe(postcss([autoprefixer(), cssnano()])) // Agrega prefijos y minifica
    .pipe(sourcemaps.write("."))         // Escribe los mapas
    .pipe(gulp.dest(paths.css))          // Guarda el CSS final
    .pipe(browserSync.stream());         // Actualiza el navegador
}

// 🔹 Servidor local + Watcher
function serve() {
  browserSync.init({
    server: {
      baseDir: "./"                     // Carpeta raíz del proyecto
    },
    notify: false                       // Desactiva notificaciones en pantalla
  });

  gulp.watch(paths.scss, compileSass);   // Escucha cambios en SCSS
  gulp.watch(paths.html).on("change", browserSync.reload); // Refresca al guardar HTML
}

// 🔹 Tareas disponibles
exports.sass = compileSass;
exports.serve = gulp.series(compileSass, serve);
exports.default = gulp.series(compileSass, serve);
