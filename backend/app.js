// declaration des constante requise a l'app
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// declaration des router
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

// conection a la base de donné mongoose
mongoose.connect('mongodb+srv://KellianG:4srUBmqgVD8paDE9@cluster0.nogwd.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  // Declaration des header pour eviter les erreur CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Parse le body de la reponse
app.use(bodyParser.json());
//dossier static pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));
//declaration des route
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;


