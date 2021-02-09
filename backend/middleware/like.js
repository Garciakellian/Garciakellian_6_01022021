const Sauce = require('../models/Sauce');//declaration du modele de donnée

//exporte le code necessaire a la fonction like/dislike
module.exports = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id }) //recupere une sauce via le modele de donné par son id
    .then(sauce => { //si la sauce est trouvé alors : 
        if(req.body.like==1 && sauce.usersLiked.indexOf(req.body.userId)<0) { //si l'user like la sauce et qu'il ne la pas encore aimer
            sauce.usersLiked.push(req.body.userId);//ajoute l'id de l'user dans l'array userliked
            sauce.likes+=1; // rajoute un j'aime a la sauce 
        } else if (req.body.like==-1 && sauce.usersDisliked.indexOf(req.body.userId)<0) {//si l'user dislike la sauce et qu'il ne la pas encore disliker
            sauce.usersDisliked.push(req.body.userId);//ajoute l'id de l'user dans l'array userDisliked
            sauce.dislikes+=1; //rajoute j'aime pas a la sauce
        } else {
            sauce.usersLiked.forEach(element => {
                if(element==req.body.userId) {
                    sauce.likes-=1;// si l'user selectionne j'aime sur une sauce quil a deja aimé, supprime le j'aime
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);//et le retire de l'arrray userLiked
                }
            });
            sauce.usersDisliked.forEach(element => {
                if(element==req.body.userId) {
                    sauce.dislikes-=1;// si l'user selectionne j'aime pas sur une sauce quil a deja dislike, supprime le dislike
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId),1);// et retire l'user de l'array dislike
                }
            });
        }
        req.body.sauce = sauce;
        next();
    })
    .catch(error => res.status(400).json({ error: "Une erreur est survenue lors de l'analyse des données!" })); //retour d'errer si la sauce n'est pas trouvé
}


