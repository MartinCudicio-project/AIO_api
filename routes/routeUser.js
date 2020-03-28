const express = require('express');

const router = express.Router();
const User = require('../models/modelUser');
const SuperUser = require('../models/modelSuperUser')
const auth = require('../middleware/auth');
const account = require('../models/modelAccount');

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
        const posts = await User.find()
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
router.get('/emailValidation/:folder',async(req,res)=>{
    try{
        const post = await User.findOneAndUpdate({
            folder: req.params.folder
        },
        {   $set:{
                emailValidation : true
            }
        })
        res.post(post)
        res.redirect('http://localhost:8080/')
    }catch(err){
        res.json(err)
    }
})

//get back the token in req.body exists in the list Token of user
router.post('/checkToken/', async(req,res)=>{
    try{
        var post = await User.findOne(
            {tokens: {$elemMatch: {token:req.body.token}}
        }).count()
        post += await SuperUser.findOne(
            {tokens: {$elemMatch: {token:req.body.token}}
        }).count()
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//retourne l'utilisateur correspondant au folder_id pris en entrée
router.post('/getUser', async(req,res)=>{
    try{
        const post = await User.findOne({
            folder : req.body.folder_id,
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

router.post('/getUserByEmail',async(req,res)=>{
    try{
        const post = await User.find({
            email : {$regex: req.body.email}});
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

router.post('/contract/getsinister',async(req,res)=>{
    try{
        const stock = await User.findOne({
            folder : req.body.folder_id,
        });
        stock.sinisters.forEach(element => {
        if (element.contract_id === req.body.contract_id)
        {
            res.json(element)
        }
        });
    }catch(err){
        res.json(err);
    }
});

router.post('/contract/updatesinister',async(req,res)=>{
    try{
        if(req.body.sinister['sinisterStep']<2)
            req.body.sinister['sinisterStep']+=1
        const updateSinister = await User.updateOne(
        {folder : req.body.folder_id}
        ,
        {
            $set:{
                "sinisters.$[elem]": req.body.sinister
            }
        },
        {
            arrayFilters:[ {
                "elem.contract_id": req.body.sinister.contract_id
            }]
        })
        res.post(updateSinister)
    }
    catch(err){
        res.json(err);
    }
});

router.post('/unvalidateUser',async(req,res)=>{
    try{
        console.log(req.body)
        const post = await User.findOneAndUpdate({
            folder: req.body.folder
        },
        {   $set:{
                emailValidation : false
            }
        })
        res.post(post)
    }catch(err){
        res.json(err)
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

// Ajout d'un sinistre dans la base de données
router.post('/contract/sinister/informations',async (req,res)=>{
    try{
        const updatedPost = await User.findOneAndUpdate({folder : req.body.folder_id},{
            //pour le $pull, $push j'ai trouvé sur la doc officielle
            //https://docs.mongodb.com/manual/reference/operator/update-array/
            $push : { 
                sinisters:{
                    contract_id: req.body.contract_id,
                    sinisterDate : req.body.sinisterDate,
                    sinisterTime: req.body.sinisterTime,
                    sinisterCircumstances: req.body.sinisterCircumstances
                }
            }
        });
        const updatedPost2 = await account.findOneAndUpdate({folder_id : req.body.folder_id},{
                $set:{
                    "listContract.$[elem].isSinistered" : true
                }
            },
            {
                multi: true,
                arrayFilters:[ {
                    "elem.contract_id": req.body.contract_id
                }]
            });
        res.json(updatedPost);
        res.json(updatedPost2);
    }catch(err){
        res.json(err);
    }
});

router.post('/updateUserInfos',async (req,res)=>{
    try{
        const post = await User.findOneAndUpdate({folder : req.body.folder},
        {$set : { 
                email: req.body.email,
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                phone:req.body.phone
            }
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

module.exports =router;