//module a exporté pour le controle d'entré du formulaire d'authentification
module.exports = (req,res,next) => {
    const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Regex pour l'email

    // regex pour le password (Requis: 8 caractere , un chiffre, une majuscule, une minuscule, une caractere special)
    const checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    //verifie la bonne forme des adresse mail et des password
    if (checkEmail.test(req.body.email)) {
        if (checkPassword.test(req.body.password)) {
            next();
        } else {
            res.status(400).json({ msg: "Mot de passe invalide ! Votre mot de passe doit contenir au moins 8 caractères et inclure: au moins un chiffre, une majuscule, une minuscule et un caractere spécial (@$!%*?&)"})
        }
    } else {
        res.status(400).json({ msg: "Adresse email invalide !"})
    }
}
