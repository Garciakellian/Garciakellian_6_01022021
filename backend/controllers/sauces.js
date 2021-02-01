const Sauce = require('../models/Sauce');// lien vers le model de donnée des sauces
const fs = require('fs');// declaration de file system
const sauceRegex =  /^[\w'\-,.0-9][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}$/;

//code pour la creation de sauce ( route post)
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  if (sauceRegex.test(sauceObjet.name)){
    if(sauceRegex.test(sauceObjet.manufacturer)){
      if(sauceRegex.test(sauceObjet.description)){
        if(sauceRegex.test(sauceObjet.mainPepper)){
          delete sauceObjet._id;
          const sauce = new Sauce({
              ...sauceObjet,
              likes: 0,
              dislikes: 0,
              usersLiked: [],
              usersDisliked: [],
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          });
          sauce.save()
          .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
          .catch(() => res.status(400).json({ message: 'erreur' }));
        } else { res.status(400).json({ msg: "champ Main Pepper Ingredient contient un caractere invalide !!"})}
      } else { res.status(400).json({ msg: "champ description contient un caractere invalide !!"})}
    } else { res.status(400).json({ msg: "champ manufacturer contient un caractere invalide !!"})}
} else { res.status(400).json({ msg: "champ name contient un caractere invalide !!"})}
};

//code pour obtenir la sauce demandé ( route get/id)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => { res.status(200).json(sauce); })
  .catch(error => res.status(400).json({ error }));
}
// code pour modifier une sauce ( route put)
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Sauce modifié !!!'}))
  .catch(error => res.status(400).json({ error }));
};
//code pour supprimé une sauce ( route delete)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};
// code pour obtenir toutes les sauces ( route get)
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then((sauces) => { res.status(200).json(sauces); })
  .catch(error => res.status(400).json({ error }));
};
// code pour like/dislike les sauces ( route post)
exports.likeSauce = (req, res, next) => {
  const sauceObjet = req.body.sauce;
  Sauce.updateOne({ _id: req.params.id },{$set: {
      likes: sauceObjet.likes,
      dislikes: sauceObjet.dislikes,
      usersDisliked: sauceObjet.usersDisliked,
      usersLiked: sauceObjet.usersLiked },
      _id: req.params.id
  })
  .then(() => res.status(200).json({ message: req.body.message}))
  .catch(error => res.status(400).json({ error: req.body.message }));
};