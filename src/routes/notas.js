const express = require("express");
const router = express.Router();

const Nota = require("../models/Nota");
const { fueAutenticado } = require("../helpers/auth");

router.get("/notas/nueva-nota", fueAutenticado, (req, res) => {
  res.render("notas/nueva-nota");
});

router.post("/notas/nueva-nota", fueAutenticado, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Por favor, inserte un title" });
  }
  if (!description) {
    errors.push({ text: "Por favor, inserte una description" });
  }
  if (errors.length > 0) {
    res.render("notas/nueva-nota", {
      errors,
      title,
      description
    });
  } else {
    /* ahora instanciamos la clase importada Nota */
    const nuevaNota = new Nota({ title, description });
    nuevaNota.user = req.user.id;
    await nuevaNota.save();
    req.flash("success_msg", "Nota agregada satisfactoriamente!");
    /* res.send("OK"); Hay que poner esto (o algún otro send) porque sino se queda procesando si no se redirecciona u otra cosa */
    res.redirect("/notas");
  }
});

router.get("/notas", fueAutenticado, async (req, res) => {
  const notas = await Nota.find({ user: req.user.id}).sort({ date: "desc" });
/*   console.log(notas);
 */  res.render("notas/todas-las-notas", { notas });
});

router.get("/notas/editar/:id", fueAutenticado, async (req, res) => {
  const nota = await Nota.findById(req.params.id);
  res.render("notas/editar-nota", { nota });
});

router.put("/notas/editar-nota/:id", fueAutenticado, async (req, res) => {
  const { title, description } = req.body;
  await Nota.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Nota actualizada satisfactoriamente!");
  res.redirect("/notas");
});

router.delete("/notas/borrar/:id", fueAutenticado, async (req, res) => {
  await Nota.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Nota eliminadada satisfactoriamente!");
  res.redirect("/notas");
});

module.exports = router;