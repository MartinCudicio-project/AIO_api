const express = require('express');

const router = express.Router();
const User = require('../models/modelUser');
const auth = require('../middleware/auth');

//ROUTES
//explication 
//https://www.youtube.com/watch?v=vjf774RKrLc 20ieme minutes


/*
HTTP POST /users - Enregistrer les utilisateurs.
HTTP POST /users/login - Autoriser les utilisateurs à se connecter.
HTTP GET / users/me - Obtenir le profil de l'utilisateur.
HTTP POST /users/logout —Déconnectez l'utilisateur
HTTP post /users/logoutall - Déconnexion de tous les appareils.
*/

//get back all the users
router.get('/all',async(req,res)=>{
    try{
        const posts = await User.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});
// -----------------MODIFY AN ACCOUNT---------------------
//return an account with its token
router.get('/:tokenId',async(req,res)=>{
    try{
        const posts = await User.findOne(
            {token: req.params.tokenID }
        );
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});



// -------------------------------------------------------

//get back if is a user is unique with the email
router.get('/checkEmail/:postEmail', async(req,res)=>{
    try{
        const post = await User.find({
            email : req.params.postEmail
        }).count();
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//permet de modifier la variable de validation de l'email
// passe la variable false de base à true
router.get('/emailValidation/:email',async(req,res)=>{
    try{
        const post = await User.findOneAndUpdate({
            email: req.params.email
        },
        {   $set:{
                emailValidation : true
            }
        })
        res.json(post)
    }catch(err){
        res.json(err)
    }
})

//get back the token in req.body exists in the list Token of user
router.post('/checkToken/', async(req,res)=>{
    try{
        const post = await User.findOne(
            {tokens: {$elemMatch: {token:req.body.token}}
        }).count()
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//créer un utilisateur avec req.body (JSON)
router.post('/', async (req, res) => {
    // Create a new user
    try {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email : req.body.email,
            emailValidation: false,
            password: req.body.password,
            folder : req.body.folder,
            phone : req.body.phone
        })
        await user.save()
        //const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).json(error);
    }
});

//permet de verifier l'authentification avec email + password
//ajout un token à la liste de l'user
router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const userTemp = await User.findByCredentials(email, password)
        if (!userTemp) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await userTemp.generateAuthToken();
        res.send({ userTemp, token });
    } 
    catch (error) {
        res.status(404).send(error);
    }
})

//cette methode va permettr d'obtenir le profil de l'utilisateur
//on auth passé en parametres qui se situe dans ../middleware/auth.js
router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})


//section 10 
//lien - https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122
router.post('/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})


//get back user_id if he exists (email,pwd)
router.get('/', async(req,res)=>{
    try{
        const post = await User.findOne({
            email : req.body.email,
            password : req.body.password
        });
        // 1. creer un token (uuid par exemple)
        // 2. storer dans une collection DB avec date expiration
        // 
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

router.delete('/:folderPost', async(req,res)=>{
    try{
        const post = await User.remove({
            folder : req.params.folderPost
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

module.exports =router;