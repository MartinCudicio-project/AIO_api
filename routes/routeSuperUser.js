const express = require('express');
const router = express.Router();
const superUser = require('../models/modelSuperUser');
const auth = require('../middleware/auth');

//get back if a user is unique with the email
router.get('/checkEmail/:postEmail', async(req,res)=>{
    try{
        const post = await superUser.find({
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
        const post = await superUser.findOneAndUpdate({
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
        const post = await superUser.findOne(
            {tokens: {$elemMatch: {token:req.body.token}}
        }).count()
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//créer un Super utilisateur avec req.body (JSON)
router.post('/', async (req, res) => {
    // Create a new user
    try {
        const user = new superUser({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email : req.body.email,
            emailValidation: false,
            password: req.body.password,
            folder : req.body.folder,
            phone : req.body.phone,
            isSuperUser : true
        })
        await user.save()
        const token = await user.generateAuthToken();
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
        const userTemp = await superUser.findByCredentials(email, password)
        if (!userTemp) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await userTemp.generateAuthToken();
        res.send({ userTemp, token });
    } 
    catch (error) {
        res.status(404).send(error)
    }
});

//cette methode va permettre d'obtenir le profil de l'utilisateur
//on auth passé en parametres qui se situe dans ../middleware/auth.js
router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
});


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
});

router.post('/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/getUser', async(req,res)=>{
    try{
        const post = await superUser.findOne({
            folder : req.body.folder_id,
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

module.exports =router;