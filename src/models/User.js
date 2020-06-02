const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const EsquemaUser = new Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    }
});

/* Necesitamos cifrar la password para no guardarla así como viene en la DB */
EsquemaUser.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // efectúa el algoritmo de cifrado diez veces (convención)
    const hash = bcrypt.hash(password, salt); // aplica el resultado anterior a la password, para generar el hash
    return hash;
};

/* Cuando el user ingrese de nuevo, debemos comparar su password con nuestro cifrado, lo logramos repitiendo el proceso anterior y comparando ambos cifrados. Para poder acceder a atributos del objeto que estamos trabajando, debemos usar "function" en lugar de "=>" porque esta última pierde el scope. */
EsquemaUser.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", EsquemaUser);