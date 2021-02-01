const mongoose = require('mongoose');// declaration de mongoose ( base de donnée)
//declaration de mongoose unique validator ( empeche la création de multiple compte avec la meme adresse email)
const uniqueValidator = require('mongoose-unique-validator');

//model de donné utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //empeche la création de multiple compte avec la meme adresse email.

module.exports = mongoose.model('User', userSchema);