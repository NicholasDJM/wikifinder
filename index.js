/*
#######  ##    #  ######   ######  ##   ##      #######   ######
   #     # #   #  #     #  #        ## ##          #     #
   #     #  #  #  #     #  ####      ###           #      #####
   #     #   # #  #     #  #        ## ##   ##  #  #           #
#######  #    ##  ######   ######  ##   ##  ##   ##      ######
//*/
const chalk = require("chalk");
const express = require("express");
const path = require("path");
const { I18n } = require("i18n");

const port = process.env.npm_package_config_port;
const i18n = new I18n({
	locales: ["en", "fr"],
	defaultLocale: process.env.npm_package_config_default_language,
	directory: path.join(__dirname, "locales"),
	objectNotation: true,
	cookie: "preferred-language",
	autoReload: true,
	retryInDefaultLocale: true,
	updateFiles: false
});

function connectionLog(req, res) {
	//*
	let c;
	switch(res.statusCode) {
	case 200:
		c=chalk.bold.green;
		break;
	case 304:
		c=chalk.bold.green;
		break;
	default:
		c=chalk.red;
	}
	console.log(chalk.green(new Date().toLocaleString()), req.method, chalk.yellow(req.url), chalk.bold.blue(req.ip), c(res.statusCode));
	//*/
	//console.log(chalk.green(new Date().toLocaleString()), req.method, chalk.yellow(req.url), chalk.bold.blue(req.ip));
}

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(i18n.init);

app.use(function(req, res, next){
	connectionLog(req, res);
	next();
});


app.use(express.static(path.join(__dirname, "/public")));
app.get("/vanilla-picker.js", function(req, res){
	res.sendFile(path.join(__dirname, "node_modules", "vanilla-picker", "dist", "vanilla-picker.js"));
});

app.get("/", function(req, res) {
	res.render("index");
});

app.get("/homepage", function(req, res) {
	res.render("homepage", { auth: false });
});

app.use(function(req, res) {
	res.status(404).render("error", { error: res.statusCode });
	connectionLog(req, res);
});
app.use(function(req, res) {
	res.status(500).render("error", { error: res.statusCode });
	connectionLog(req, res);
});



if (port !== undefined) {
	if (Number.isInteger(Number(port))) {
		app.listen(port, () => {
			console.log("Listening on port", chalk.bold.yellow(port));
		});
	}
} else{
	console.error(chalk.red("Cannot start with empty config variable.\nMake sure to start the server with 'npm start'."));
	process.exit(1);
}
