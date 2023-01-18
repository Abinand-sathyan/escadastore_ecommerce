//var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
var http = require("http");
var app = express();
var flash=require("connect-flash")

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");

//view engine setup
app.set("views", path.join(__dirname, "views")); 

// Set view engine as EJS
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "testkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:7000000},
    
  })
);

app.use("/admin", adminRouter);
app.use("/", usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

//var server = http.createServer(app);
//server.listen(3000);

module.exports=app