const mongoose = require('mongoose');

// https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122
// creation de token generation etc, lien qui explique au dessus
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = "WinterIsComing2019"

const SinisterSchema = mongoose.Schema({
    contract_id : {
        type : String,
        required : true
    },
    sinisterDate: {
        type : String,
        required : true
    },
    sinisterTime: {
        type : String,
        required : true
    },
    sinisterCircumstances: {
        type : String,
        required : true
    }
})

const PostSchema = mongoose.Schema({
    first_name : {
        type :String,
        required: true
    },
    last_name : {
        type :String,
        required: true
    },
    email : {
        type :String,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    folder :{
        //le numero de son dossier d'assurance
        //on utilise la bibli uuid pour generer un numero de dossier unique
        //servira dans une autre collection comme clé primaire pour recuperer les dossiers etc..
        type: String
    },
    photo :{
        type: String,
        required: false
    },
    phone :{
        type: String,
        require: true
    },
    tokens :[{
        token:{
            type: String,
            required: false
        }
    }],
    sinisters:[SinisterSchema]
});

PostSchema.pre('save',async function(next){
    //on hash le mdp avant d'enregistrer dans le model
    const user = this;
    if(user.isModified('password')){
        user.password  = await bcrypt.hash(user.password,8)        
    };
    next()
});

PostSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

PostSchema.statics.findByCredentials = async function(email, password){
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('users',PostSchema);
module.exports = User;