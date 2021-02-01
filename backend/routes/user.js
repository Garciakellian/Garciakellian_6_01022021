//declaration des constante necessaire
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');//Lien avec le controlleur afin d'aller chercher le code necessaire
const signupRegex = require('../middleware/signupFormRegex')// lien avec le midlleware pour le controle d'entré lors de l'inscription.

router.post('/signup', signupRegex, userCtrl.signup); // route pour l'inscription
router.post('/login', userCtrl.login); // route pour la connection

module.exports = router;