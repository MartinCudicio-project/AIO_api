const express = require('express');

const router = express.Router();
const Post = require('../models/modelUser');
const uuidv4 = require('uuid/v4');
//ROUTES

//get back all the posts
router.get('/',async(req,res)=>{
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});

//get back user_id if he exists (email,pwd)
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

//specific get with id
router.get('/:postEmail/:postPwd', async(req,res)=>{
    console.log(req.params.postEmail);
    try{
        const post = await Post.find({
            email : req.params.postEmail,
            password : req.params.postPwd
        }).count();
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

module.exports =router;