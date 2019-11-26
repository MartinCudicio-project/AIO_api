const express = require('express');

const router = express.Router();
const AccountModel = require('../models/modelAccount');
const uuidv4 = require('uuid/v4');
//ROUTES

//get back all the account
router.get('/',async(req,res)=>{
    try{
        const posts = await AccountModel.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});

//get back contract with folder id 
router.get('/:folderId', async(req,res)=>{
    try{
        const post = await AccountModel.findOne({
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
    const post = new AccountModel({
        folder_id : req.params.folderId
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
        console.log(req.body)
        const updatedPost = await AccountModel.updateOne({folder_id : req.params.folderId},{
            //pour le $pull, $push j'ai trouvé sur la doc officielle
            //https://docs.mongodb.com/manual/reference/operator/update-array/
            $push : { listContract : {
                contract_id : req.body.contract_id,
                object : req.body.object
            }}
        });
        res.json(updatedPost);
    }catch(err){
        res.json(err);
    }
});

//delete an entire account with its folder_id
router.delete('/:folderId',async (req,res)=>{
    try{
        const rmContract = await AccountModel.remove(
        {folder_id : req.params.folderId}
        );
        res.json(rmContract);
    }catch(err){
        res.json(err);
    }
});

//delete all contracts from an account identified by folder_id
router.delete('/contract/:folderId',async (req,res)=>{
    try{
        const rmContract = await AccountModel.updateOne(
        {folder_id : req.params.folderId},
        //https://docs.mongodb.com/manual/reference/operator/update/pull/
        {$pull : {listContract : {} } 
        //aucun critere pour le filtre
        //on supprimme tous les contrats
    });
        res.json(rmContract);
    }catch(err){
        res.json(err);
    }
});

//delete just a contract identified by contract_id from an account identified by folder_id
router.delete('/contract/:folderId/:contractId',async (req,res)=>{
    try{
        console.log(req.params.contractId);
        const rmContract = await AccountModel.updateOne(
        {folder_id : req.params.folderId},
        //https://docs.mongodb.com/manual/reference/operator/update/pull/
        {$pull : {listContract : {contract_id : req.params.contractId} } 
        //le filtre est le contractId, tout le reste ne sera pas supp
        //pour faire le contraire utilise $in
    });
        res.json(rmContract);
    }catch(err){
        res.json(err);
    }
});

module.exports =router;