const fs = require("fs");
const path = require("path");
const stripJsonComments = require("strip-json-comments");
const exec = require("child_process").execFile;
console.log("Attempting to run Browserify . . .");
exec("cmd.exe", ["/c", "cd", "/d", __dirname, "&npx.cmd", "browserify", "public/javascript/bookmarks.js", "-o", "public/javascript/bookmarks.bundle.js"], (error, data)=>{
	if (error) {
		console.error("Failed Browserify bookmarks.js:", data);
		throw error;
	}
});
console.log("Done.");
function writeJson(fileToRead, fileToWrite) {
	console.log("Attempting to run JSON Comments . . .");
	let content = fs.readFileSync(path.join(__dirname, "locales", fileToRead), "utf8");
	//console.dir(content);
	let data = stripJsonComments(content, {whitespace:false});
	//console.log(data);
	fs.writeFileSync(path.join(__dirname, "locales", fileToWrite), data);
	console.log("Done.");
}
writeJson("en.jsonc", "en.json");
writeJson("fr.jsonc", "fr.json");
