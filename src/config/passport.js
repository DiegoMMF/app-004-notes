const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.use(
  new LocalStrategy({ usernameField: "correo" },
    async (correo, password, done) => {
      const user = await User.findOne({ correo: correo });
      if (!user) {
        return done(null, false, { message: "No se ha encontrado el user." });
      } else {
        const match = await user.matchPassword(password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "password incorrecta. " });
        }
      }
    }
  )
);

/* la anterior es la solución de Fazt, la de abajo, es la solución oficial del módulo propuesta en npmjs.com donde, claramente, su .verifyPassword es nuestra .matchPassword
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
); */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
