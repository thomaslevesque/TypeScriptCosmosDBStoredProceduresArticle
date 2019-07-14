const gulp = require("gulp");
const ts = require("gulp-typescript");
const path = require("path");
const flatmap = require("gulp-flatmap");
const replace = require('gulp-replace');
const concat = require('gulp-concat');

gulp.task("build-cosmos-server-scripts", function() {
    const sharedScripts = "CosmosServerScriptHelpers/*.ts";
    const tsServerSideScripts = "StoredProcedures/**/*.ts";

    return gulp.src(tsServerSideScripts)
        .pipe(flatmap((stream, file) =>
        {
            let outFile = path.join(path.dirname(file.relative), path.basename(file.relative, ".ts") + ".js");
            let tsProject = ts.createProject("tsconfig.json");
            return stream
                .pipe(gulp.src(sharedScripts))
                .pipe(tsProject())
                .pipe(replace(/^\s*import .+;\s*$/gm, ""))
                .pipe(replace(/^\s*export .+;\s*$/gm, ""))
                .pipe(replace(/^\s*export /gm, ""))
                .pipe(concat(outFile))
                .pipe(gulp.dest("StoredProcedures"));
        }));
});

gulp.task("default", gulp.series("build-cosmos-server-scripts"));
