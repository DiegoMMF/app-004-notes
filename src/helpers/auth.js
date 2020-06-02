const helpers = {};

helpers.fueAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error_msg", "No autorizado.");
        res.redirect("/users/loguearse");
    };
};

module.exports = helpers;