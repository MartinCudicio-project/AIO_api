const express = require('express');

const router = express.Router();
const Post = require('../models/modelUser');
const uuidv4 = require('uuid/v4');
//ROUTES
//explication 
//https://www.youtube.com/watch?v=vjf774RKrLc 20ieme minutes

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

//submit a post
router.post('/',async (req,res)=>{
    console.log(req.body);
    const post = new Post({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email : req.body.email,
        password: req.body.password,
        folder : uuidv4()
    });
    try{   
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message:err});
    }
});

//get back user_id if he exists (email,pwd)
router.get('/', async(req,res)=>{
    try{
        const post = await Post.findOne({
            email : req.body.email,
            password : req.body.password
        });
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