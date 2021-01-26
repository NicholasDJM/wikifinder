/*

#######  ##    #  ######   ######  ##   ##          #######   ######
   #     # #   #  #     #  #        ## ##              #     #
   #     #  #  #  #     #  ####      ###               #      #####
   #     #   # #  #     #  #        ## ##     ##    #  #           #
#######  #    ##  ######   ######  ##   ##    ##     ##      ######

//*/

const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const express = require("express");
//const fs = require("fs");
const http = require("http");
//const https = require("https");
const path = require("path");
const { I18n } = require("i18n");
//const favicon = require("serve-favicon");
const sanitizeMiddleware = require("sanitize-middleware");
const { decode } = require("url-encode-decode");

//const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
//const certificate = fs.readFileSync("sslcert/server.crt", "utf8");
//const credentials = {key: privateKey, cert: certificate};

const port = process.env.npm_package_config_port;
const locale = new I18n({
	locales: ["en", "fr"],
	defaultLocale: process.env.npm_package_config_default_language,
	directory: path.join(__dirname, "locales"),
	objectNotation: true,
	cookie: "preferredLanguage",
	autoReload: true,
	retryInDefaultLocale: true,
	updateFiles: false
});
function connectionLog(request, response) {
	let c=chalk.red;
	let c2=chalk.bold.green;
	switch(response.statusCode) {
	case 200:
		c=c2;
		break;
	case 201:
		c=c2;
		break;
	case 304:
		c=c2;
		break;
	}
	console.log(chalk.bold.white(new Date().toLocaleString()), request.method, chalk.yellow(request.url), chalk.bold.blue(request.ip), request.headers["user-agent"], c(response.statusCode));
}

let APICallsToday=0;
// Steam Web API has a hard limit of 100,000 (Hundred Thousand) calls per day per web key.
// This may be changed if we do have that many calls and we talk to customer support
// Some calls can be queued up, like calls to ISteamUser/GetPlayerSummaries can be sent with 100 SteamIDs at once.
const maxAPICalls=100000;

//let time = new Date().toUTCString();
//function rateLimit() {}

//function queue() {}

let errorCode=200;

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(locale.init);
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(sanitizeMiddleware());
app.use(function(request, response, next){
	connectionLog(request, response);
	next();
});


app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function(request, response) {
	response.render("index");
});
app.get("/legal", function(request, response) {
	response.render("legal", {title:response.__("legal_title")});
});
app.get("/setup", function(request, response) {
	response.render("setup", {title:response.__("setup_title")});
});

app.get("/homepage", function(request, response) {
	response.render("homepage", { auth: false });
});

const fetch = require("request").defaults({ encoding: null });  //eslint-disable-line unicorn/no-null

app.get("/encode", function(request, response, next) {
	let url=request.query.url;
	if (url===undefined || url=="") {
		errorCode=400;
		next();
	} else {
		let decodedString=String(decode(url));
		// https://stackoverflow.com/questions/17124053/node-js-get-image-from-web-and-encode-with-base64
		fetch.get(decodedString, function (error, fetchResponse, body) {
			if (!error && fetchResponse.statusCode == 200) {
				const data = "data:" + fetchResponse.headers["content-type"] + ";base64," + Buffer.from(body).toString("base64");
				response.status(201).send(data);
				connectionLog(request, response);
			} else {
				errorCode=400;
				next();
			}
		});
	}
});
app.use(function(request, response, next) {
	if (errorCode==400) {
		response.status(errorCode).render("error", { error: errorCode });
		errorCode=200;
		connectionLog(request, response);
	} else {
		next();
	}
});
app.use(function(request, response) {
	response.status(404).render("error", { error: response.statusCode });
	connectionLog(request, response);
});
app.use(function(request, response) {
	response.status(500).render("error", { error: response.statusCode });
	connectionLog(request, response);
});

let httpServer = http.createServer(app);
//let httpsServer = https.createServer(credentials, app);
console.log("Listening on port", chalk.yellow(port), "and on port", chalk.yellow("443"));

httpServer.listen(port);
//httpsServer.listen(443);