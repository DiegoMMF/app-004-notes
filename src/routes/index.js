const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    /* Si quisiéramos enviar un mensaje, pondríamos: res.send("Estás en el /index"); */
    res.render("index");
});

router.get("/about", (req, res) => {
    /* Si quisiéramos enviar un mensaje, pondríamos: res.send("Estás en el /about"); */
    res.render("about");
});

module.exports = router;