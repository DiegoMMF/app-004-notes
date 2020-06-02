const mongoose = require("mongoose");
const { Schema } = mongoose;

const EsquemaNota = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fecha: {
        type: Date, 
        default: Date.now
    },
    user: {
        type: String
    }
});

module.exports = mongoose.model("Nota", EsquemaNota);