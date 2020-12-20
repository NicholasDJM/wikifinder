#!npm start
const path = require("path");
//const fs = require("fs");
const express = require("express");
const pug = require("pug"); // Pug = Jade, changed names due to trademarks. https://github.com/pugjs/pug/issues/2184
const chalk = require("chalk");
const requestIp = require("request-ip");
//const less = require("less");

function connection_log(req,res) {
	let redorgreen = chalk.red(res.statusCode);
	if (res.statusCode==200) {
		redorgreen = chalk.green(res.statusCode);
	} else if (res.statusCode>99) if (res.statusCode<200) {
		redorgreen = chalk.bold.yellow(res.statusCode);
	} else if (res.statusCode==200) {
		redorgreen = chalk.green(res.statusCode);
	} else if (res.statusCode==304) {
		redorgreen = chalk.green(res.statusCode);
	}
	console.log(chalk.bold.white(new Date().toLocaleString())+">",req.method, '"'+chalk.yellow(req.url)+'"','"'+chalk.bold.blue(req.clientIp)+'"',req.headers['user-agent'],'['+redorgreen+']');
}


const app = express();
const port = 80;
const address = "127.0.0.1";
// Default address should be "localhost", "127.0.0.1", or "::1"
const title = "WikiFinder"

const default_lang="en"

const terms={
	en:{
		tos:"Terms of Service",
		help:"Help and Contact Info"
	},
	fr:{
		tos:"Conditions d'utilisation",
		help:"Aide et informations de contact"
	}
}

app.use(requestIp.mw());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'public','views'));

app.get('/', (req, res) => {
	let lang=default_lang;
	res.render("main", {title: title,page:"home",lang:lang});
	connection_log(req,res)
})
app.get('/terms-of-service', (req, res) => {
	let lang=default_lang;
	res.render("main", {title: title+" - "+terms[lang]["tos"],page:"tos",lang:lang});
	connection_log(req,res)
})
//app.use(express.static(path.join(__dirname,"public","localised")));
app.get('/terms-of-service.txt', (req, res) => {
	let lang=default_lang;
	res.sendFile(path.join(__dirname,"public","localised","terms-of-service-"+lang+".txt"));
	connection_log(req,res);
})
app.get('/support', (req, res) => {
	let lang=default_lang;
	res.render("main", {title: title+" - "+terms[lang]["help"],page:"support",lang:lang});
	connection_log(req,res)
})
app.get('/primary.css', (req, res) => {
	res.sendFile(__dirname + "/public/primary.css");
	connection_log(req,res)
})

//app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req,res,next){
	res.status(404).sendFile(path.join(__dirname,'/public/notfound.html'))
	connection_log(req,res);
})
app.use(function(err,req,res,next){
	res.status(500);
	res.send("<link rel='stylesheet' href='primary.css'><body class='main'><h2>Error 500: Internal server error.</h2></body>");
	console.error(err.stack);
	connection_log(req,res)
})

try {
	app.listen(port,address, () =>{
		console.log("Starting server at address",chalk.bold.blue(address)+", on port",chalk.yellow(port)+"...")
	});
} catch (error){
	if (error.code=="EADDRINUSE") {
		consoel.error("There's already a server running on port",port)
	}
}
