::@echo off
echo Building . . .
echo Running Browserify on bookmarks.js . . .
cmd /c "cd %CD%&npx browserify public/javascript/bookmarks.js -o public/javascript/bookmarks.bundle.js" || set error=1&goto fail
if %errorlevel% GTR 0 set error=1&goto fail
echo Running Build.js . . .
cmd /c "cd %CD%npm ./build.js" || set error=1&goto fail
if %errorlevel% GTR 0  set error=1&goto fail
echo Done.
exit /b 0
:fail
if [%error%]==[1] echo Browserify failed to compile bookmarks.js. Exiting . . .
if [%error%]==[2] echo Failed to complete Build.js. Exiting . . .
if %error% GTR 2 echo Unknown error. Exiting . . .
exit /b %error%