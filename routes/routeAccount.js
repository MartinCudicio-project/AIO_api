const express = require('express');

const router = express.Router();
const Post = require('../models/modelAccount');
const uuidv4 = require('uuid/v4');
//ROUTES

//get back all the account
router.get('/',async(req,res)=>{
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});

//get back contract with folder id 
router.get('/:folderId', async(req,res)=>{
    try{
        const post = await Post.find({
            folder_id : req.params.folderId,
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//on initialise le compte d'un user avec son folder_id unique
//permet juste de faire l'initialisation
//on créera d'autre methode pour ajouter un contrat etc..
router.post('/:folderId',async (req,res)=>{
    console.log(req.params.folderId);
    const post = new Post({
        folder_id : req.params.folderId,
        listContrat : [],
        contract : []
    });
    try{   
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message:err});
    }
});

//patch permet de modifer partielement sans ecraser l'objet
//1) patch pour créer un contrat
//on utilise un params pour identifier le contrat à modifier
//les informations à modifier sur le contrat seront communiquer 
//par body : JSON

router.post('/contract/:folderId',async (req,res)=>{
    try{
        const updatedPost = await Post.updateOne({folder_id : req.params.folderId},{
            $set : { contract : req.body.contract}
        });
        res.json(updatedPost);
    }catch(err){
        res.json(err);
    }
});

router.delete('/contract/:folderId/:contractId',async (req,res)=>{
    try{
        const rmContract = await Post.remove(
        {contract : {contract_id : req.params.contractId}
        });
        res.json(rmContract);
    }catch(err){
        res.json(err);
    }
});



module.exports =router;