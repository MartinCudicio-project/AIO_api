const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    first_name : {
        type :String,
        require: true
    },
    last_name : {
        type :String,
        require: true
    },
    email : {
        type :String,
        require: true
    },
    password :{
        type: String,
        require: true
    },
    folder :{
        //le numero de son dossier d'assurance
        //on utilise la bibli uuid pour generer un numero de dossier unique
        //servira dans une autre collection comme clé primaire pour recuperer les dossiers etc..
        type: String
    },
    photo :{
        type: String,
        require: false
    }
});

module.exports = mongoose.model('users',PostSchema);