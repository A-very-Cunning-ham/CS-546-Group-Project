// Setup server, session and middleware here.
const express = require("express");
const app = express();
const static = express.static(__dirname + '/public');
const session = require("express-session");
const configRoutes = require("./routes");
const fileUpload = require('express-fileupload');

const exphbs = require("express-handlebars");

const cookieParser = require("cookie-parser");

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload());

app.engine("handlebars", exphbs.engine({
	defaultLayout: "main",
	partialsDir: ["views/partials/"]
 }));
app.set("view engine", "handlebars");

app.use(
	session({
		name: "AuthCookie",
		secret: "some super secret string!",
		resave: false,
		saveUninitialized: true,
	})
);

let logger = (req, res, next) => {
	let current_datetime = new Date().toUTCString();

	let method = req.method;
	let url = req.originalUrl;

	let auth = req.session.user ? "Authenticated User" : "Non-Authenticated User";

	let log = `[${current_datetime}] ${method}:${url} (${auth})`;
	console.log(log);
	next();
};

app.use(logger);

configRoutes(app);

app.listen(3000, () => {
	console.log("Server is now running on http://localhost:3000");
});
