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
        type: Number,
        require: false
    },
    photo :{
        type: String,
        require: false
    }
});

module.exports = mongoose.model('users',PostSchema);