const chalk = require("chalk");
const express = require("express");
const path = require("path");
const requestIp = require("request-ip");

const port = process.env.npm_package_config_port; // eslint-disable-line no-undef
const default_language = process.env.npm_package_config_default_language; // eslint-disable-line no-undef

const app = express();
app.use(requestIp.mw());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // eslint-disable-line no-undef

app.use((req, res, next) => {
	console.log(new Date().toLocaleString(), ">", req.method, chalk.yellow(req.url), chalk.bold.blue(req.clientIp));
	next();
});

app.get("/", function(req, res) {
	res.render("test", {
		"title": "Test Page"
	});
});

if (port != undefined) {
	app.listen(port, () => {
		console.log("Listening on port", chalk.bold.yellow(port));
	});
} else {
	console.error(chalk.red("Cannot start with empty config variable.\nMake sure to start the server with 'npm start'."));
}