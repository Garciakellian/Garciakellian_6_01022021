const bcrypt = require('bcrypt'); // declaration de bcrypt
const User = require('../models/users') //lien vers le modele de donné user
const jwt = require('jsonwebtoken');//declaration json web token

//Prend l'email fourni par l'utilisateur et le password apres le hash de Bcrypt afin d'enregistré un user
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            email: req.body.email,
            password: hash
          });
          user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}
//code pour la connexion
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })//rechere l'email dans la base de donné
      .then(user => {
        if (!user) {//Si l'email n'est pas trouvé dans la base de donné
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }//sinon compare le password de la requete et celui correspondant a l'email dans la base de donné
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {//Si le password correspond pas
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({//sinon donne un token a l'user 
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };