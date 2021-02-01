// declaration des constante 
const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauces'); // lien avec le controlleur afin de recuperé le code necessaire
const multer = require('../middleware/multer-config'); // lien avec le midleware multer afin d'enregistré les images
const like = require('../middleware/like'); // lien avec le middleware afin de like/dislike les sauces
const auth = require('../middleware/auth'); // lien avec le middleware pour l'authentification

router.post('/', auth, multer, sauceController.createSauce,);// route post ( crée une nouvelle sauce)
router.get('/', auth, sauceController.getAllSauce); // route get ( afficher toutes les sauces)
router.get('/:id', auth, sauceController.getOneSauce); // route get/id ( affiche la sauce demandé )
router.put('/:id', auth, multer, sauceController.modifySauce);// route put ( modifier une sauce)
router.delete('/:id', auth, sauceController.deleteSauce); // route delete ( supprime une sauce)
router.post('/:id/like', auth, like, sauceController.likeSauce); // route post ( necessaire pour like/dislike une sauce)


module.exports = router;