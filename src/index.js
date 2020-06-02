const express = require("express"); // línea convertida a ES6 NO FUNCIONA -> import express from "express";
const path = require("path");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const methodOverRide = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

// INICIALIZACIONES
const app = express();
require("./database");
require("./config/passport");

// CONFIGURACIONES
app.set("port", process.env.PORT || 5000); // si el entorno (plataforma) me brinda puerto, bien, sino, uso 3000
app.set("views", path.join(__dirname, "views")); // __dirname me devuelve la carpeta donde se está ejecutando este archivo (en este caso: src)
app.engine(".hbs", exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"), /* Probar si anda reemplazando app.get("views") por path.join(__dirname, "views") */
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", ".hbs");

// FUNCIONES INTERMEDIARIAS (MIDDLEWARES)
app.use(express.urlencoded({extended: false}));
app.use(methodOverRide("_method"));
app.use(session({
    secret: "miappsecreta",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// VARIABLES GLOBALES
app.use((req, res, next) => {
    /* va a recibir los mensajes a través de flash */
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next(); // esta orden es para que el navegador no se quede colgado procesando
})

// RUTAS
app.use(require("./routes/index"));
app.use(require("./routes/users"));
app.use(require("./routes/notas"));

// ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, "public")));

// SERVIDOR
app.listen(app.get("port"), () => {
    console.log(`Servidor en puerto ${app.get("port")}`);
});