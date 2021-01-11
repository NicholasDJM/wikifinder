const chalk = require("chalk");
const express = require("express");
const path = require("path");
const {
	I18n
} = require("i18n");

const port = process.env.npm_package_config_port;
const default_language = process.env.npm_package_config_default_language;
const i18n = new I18n({
	locales: ["en", "fr"],
	directory: path.join(__dirname, "locales"),
	objectNotation: true,
	cookie: "desired-language"
});

const app = express();
//app.use(requestIp.mw());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
	console.log(chalk.bold.green(new Date().toLocaleString()), req.method, chalk.yellow(req.url), chalk.bold.blue(req.ip));
	next();
});
app.use(i18n.init);

app.use(express.static(path.join(__dirname, "/public")));
app.get("/", function(req, res) {
	res.render("index");
	console.log(res.__("title"));
});

app.use(function(req, res) {
	let lang = default_language;
	res.status(404).render("error", {
		title: "Error 404",
		error: 404,
		terms: {
			e404: "File not found"
		},
		lang: lang
	});
});
app.use(function(req, res) {
	let lang = default_language;
	res.status(500).render("error", {
		title: "Error 500",
		error: 500,
		terms: {
			e500: "Internal Server Error"
		},
		lang: lang
	});
});

if (port != undefined) {
	app.listen(port, () => {
		console.log("Listening on port", chalk.bold.yellow(port));
	});
} else {
	console.error(chalk.red("Cannot start with empty config variable.\nMake sure to start the server with 'npm start'."));
}
