echo Building . . .
echo Running Browserify on bookmarks.js . . .
npx browserify public/bookmarks.js -o bookmarks.bundle.js || call :fail 1
if %errorlevel% GTR 0 call :fail 0
echo Done.
exit /b 0
:fail
if [%1]==[0] echo Unknown error. Exiting . . .
if [%1]==[1] echo Browserify failed to compile bookmarks.js. Exiting . . .
exit /b 1