const mongoose = require('mongoose');// declaration de mongoose ( base de donnée)
//declaration de mongoose unique validator ( empeche la création de multiple sauce avec la meme nom)
const mongooseUniqueValidator = require('mongoose-unique-validator');

//model de donné des sauces
const sauceSchema = mongoose.Schema ({
    userId: { type: String, required: true },
    name: { type: String, required: true, unique: true},
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true }
});

sauceSchema.plugin(mongooseUniqueValidator); //empeche la création de multiple sauce avec la meme nom.

module.exports = mongoose.model('Sauce', sauceSchema);