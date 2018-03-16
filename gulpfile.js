const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require("gulp-concat");

var files = fs.readdirSync("src"), gjtool,pub;

for(var i=0;i<files.length;i++){
	if(files[i] == 'gjTool.js'){
		gjtool = "./src/"+files[i];
		delete files[i]
	}
	if(files[i] == 'public.js'){
		pub = "./src/"+files[i];
		delete files[i]
	}
}

files.forEach(function(item,index){
	files[index] = "./src/"+files[index];
});

files.unshift(pub);

files.unshift(gjtool);

gulp.task('mini', () => (
  gulp.src(files)
  .pipe(concat('gjtool.js'))
  .pipe(gulp.dest('dist'))
  .pipe(uglify())//uglify
  .pipe(rename("gjtool.min.js"))
  .pipe(gulp.dest('dist'))
));