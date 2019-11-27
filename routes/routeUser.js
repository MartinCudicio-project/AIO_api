const express = require('express');

const router = express.Router();
const Post = require('../models/modelUser');
const uuidv4 = require('uuid/v4');
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
router.get('/',async(req,res)=>{
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});

//get back if is a user is unique with the email
router.get('/:postEmail', async(req,res)=>{
    try{
        const post = await Post.find({
            email : req.params.postEmail
        }).count();
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
            password: req.body.password,
            folder : uuidv4()
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
});


router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})
/*
router.post('/',async (req,res)=>{
    console.log(req.body);
    const post = new Post({
        
    });
    try{   
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message:err});
    }
});
*/

//get back user_id if he exists (email,pwd)
router.get('/', async(req,res)=>{
    try{
        const post = await Post.findOne({
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

router.delete('/:postEmail', async(req,res)=>{
    try{
        const post = await Post.remove({
            email : req.params.postEmail
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

module.exports =router;