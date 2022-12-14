// Setup server, session and middleware here.
const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");

const exphbs = require("express-handlebars")

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string',
    resave: false,
    saveUninitialized: true
}));

configRoutes(app);

app.listen(3000, () =>{
    console.log("Server is now running");
});