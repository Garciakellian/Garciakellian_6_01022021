const multer = require('multer');// declaration multer

//declaration des format d'images accepté
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// code pour l'enregistré les images
const storage = multer.diskStorage({
  destination: (req, file, callback) => { // Dossier ou les images sont enregistré
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // modification du nom de fichier
    const name = file.originalname.split(' ').join('_'); //remplacé les espace par des unerscore(_)
    const extension = MIME_TYPES[file.mimetype]; //extention de fichier
    callback(null, name + Date.now() + '.' + extension); //reprend le nom, ajoute la date et l'extention pour pas avoir des fichier avec le meme nom.
  }
});

module.exports = multer({storage: storage}).single('image');