const express = require("express");
const router = express.Router();

const User = require("../models/User");

const passport = require("passport");

router.get("/users/loguearse", (req, res) => {
    /* res.send("Estás en la página de logueo"); */
    res.render("users/loguearse");
});

router.post("/users/loguearse", passport.authenticate("local", {
    successRedirect: "/notas",
    failureRedirect: "/users/loguearse",
    failureFlash: true
}));

router.get("/users/registrarse", (req, res) => {
    /* res.send("Estás en la página de registro inicial"); */
    res.render("users/registrarse");
});

router.post("/users/registrarse", async (req, res) => {
    const { nombre, correo, password, password2 } = req.body;
    const errors = [];
    if (nombre.length === 0 || password.length === 0 || correo.length === 0 || password2.length === 0) {
        errors.push({ text: "Todos los campos deben completarse."});
    }
    if (password !== password2) {
        errors.push({ text: "Las passwords no coinciden."});
    };
    if (password.length < 4) {
        errors.push({ text: "La password debe tener al menos 4 caracteres."});
    };
    if (errors.length > 0) {
        res.render("users/registrarse", { errors, nombre, correo, password, password2 });
    } else {
        const correoUser = await User.findOne({ correo: correo });
        /* Cambiar las dos líneas siguientes de código porque no tira el error en pantalla (tal vez usando un switch) */
        console.log("correoUser: ", correoUser);
        if (correoUser) {
            req.flash("error_msg", "El correo ya está siendo utilizado.");
            res.redirect("/users/registrarse");
        };
        const nuevoUser = new User({ nombre, correo, password });
        nuevoUser.password = await nuevoUser.encryptPassword(password);
        await nuevoUser.save();
        req.flash("success_msg", "Has sido registrado.");
        res.redirect("/users/loguearse");
    };
});

router.get("/users/salir", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;