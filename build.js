const fs = require("fs");
const path = require("path");
const stripJsonComments = require("strip-json-comments");
const exec = require("child_process").execFileSync;
function runBrowserify(file, override="") {
	console.log("Attempting to run Browserify on "+file+". . .");
	if (override=="") {
		exec("cmd.exe", ["/c", "cd", "/d", __dirname, "&npx.cmd", "browserify", file, "-o", file.substring(0, file.length - 3)+".bundle.js"]); //eslint-disable-line unicorn/prefer-string-slice
	} else {
		exec("cmd.exe", ["/c", "cd", "/d", __dirname, "&npx.cmd", "browserify", file, "-o", override]); //eslint-disable-line unicorn/prefer-string-slice
	}
	console.log("Done.");
}
function writeJson(fileToRead, fileToWrite) {
	console.log("Attempting to run JSON Comments "+fileToRead+". . .");
	let content = fs.readFileSync(path.join(__dirname, "locales", fileToRead), "utf8");
	//console.dir(content);
	let data = stripJsonComments(content, {whitespace:false});
	//console.log(data);
	fs.writeFileSync(path.join(__dirname, "locales", fileToWrite), data);
	console.log("Done.");
}
runBrowserify("public/javascript/bookmarks.js");
writeJson("en.jsonc", "en.json");
writeJson("fr.jsonc", "fr.json");
