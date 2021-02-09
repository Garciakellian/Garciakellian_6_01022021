const Sauce = require('../models/Sauce');// lien vers le model de donnée des sauces
const fs = require('fs');// declaration de file system
const sauceRegex =  /^[\w'\-,.0-9][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}$/;

//code pour la creation de sauce ( route post)
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);//parse la requete
  if (sauceRegex.test(sauceObjet.name)){//controle regex du champ name,
    if(sauceRegex.test(sauceObjet.manufacturer)){//si champ name ok, controle le champ manufacturer
      if(sauceRegex.test(sauceObjet.description)){//si champ manufacturer ok, controle le champ description
        if(sauceRegex.test(sauceObjet.mainPepper)){//si le champ description ok, controle le champ mainPepper
          delete sauceObjet._id;//si tout le regex sont ok, on supprime l'id donné par le header
          const sauce = new Sauce({ //creation d'une nouvelle sauce en se basant sur notre modele 
              ...sauceObjet, //on recupere le corp de la requete parsé, on y rajoute like, dislike, userliked, userDislikes, et l'url de l'image car requis
              likes: 0,
              dislikes: 0,
              usersLiked: [],
              usersDisliked: [],
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          });
          sauce.save()
          .then(() => res.status(201).json({ message: 'Objet enregistré !'}))//si tout ce passe bien, renvoi un statut 201
          .catch(() => res.status(400).json({ message: 'erreur' })); //sinon renvoi un statut 400 
        } else { res.status(400).json({ msg: "champ Main Pepper Ingredient contient un caractere invalide !!"})}//renvoi un message d'erreur si le champ mainPepper n'est pas validé par le regex
      } else { res.status(400).json({ msg: "champ description contient un caractere invalide !!"})}//renvoi un message d'erreur si le champ description n'est pas validé par le regex
    } else { res.status(400).json({ msg: "champ manufacturer contient un caractere invalide !!"})}//renvoi un message d'erreur si le champ manufacturer n'est pas validé par le regex
} else { res.status(400).json({ msg: "champ name contient un caractere invalide !!"})}//renvoi un message d'erreur si le champ name n'est pas validé par le regex
};

//code pour obtenir la sauce demandé ( route get/id)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//recherche de l'id de la sauce demandé
  .then((sauce) => { res.status(200).json(sauce); })
  .catch(error => res.status(400).json({ error }));
}
// code pour modifier une sauce ( route put)
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { //regarde si req.file existe. Si oui, on enregistre la nouvelle image.
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })// sinon on s'occupe uniquement de l'objet mis a jour
  .then(() => res.status(200).json({ message: 'Sauce modifié !!!'}))
  .catch(error => res.status(400).json({ error }));
};
//code pour supprimé une sauce ( route delete)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//recupere la sauce par son id dans la base de donné
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];//extrait le nom du fichier
    fs.unlink(`images/${filename}`, () => { //suprime le fichier
      Sauce.deleteOne({ _id: req.params.id })//suprime la sauce
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
//recupere une sauce par son id, et met a jour les donné sur les like
exports.likeSauce = (req, res, next) => {
  const sauceObjet = req.body.sauce;
  Sauce.updateOne({ _id: req.params.id },{set: {
      likes: sauceObjet.likes, 
      dislikes: sauceObjet.dislikes,
      usersDisliked: sauceObjet.usersDisliked,
      usersLiked: sauceObjet.usersLiked },
      _id: req.params.id
  })
  .then(() => res.status(200).json({ message: req.body.message}))
  .catch(error => res.status(400).json({ error: req.body.message }));
};