const mongoose = require("mongoose"); // import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(db => console.log("Base de Datos conectada..."))
.catch(err => console.log(err));