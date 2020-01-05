const express = require('express');

const router = express.Router();
const AccountModel = require('../models/modelAccount');
const uuidv4 = require('uuid/v4');
//ROUTES

//get back all the account
router.get('/all',async(req,res)=>{
    try{
        const posts = await AccountModel.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});

//retourne tous les contrats d'un folder
//à partir de req.body folder_id:
router.post('/', async(req,res)=>{
    try{
        const post = await AccountModel.findOne({
            folder_id : req.body.folder_id,
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//retourne toutes les assurances d'un contrat
//avec son contract_id en req body
router.post('/', async(req,res)=>{
    try{
        const post = await AccountModel.findOne({
            folder_id : req.body.folder_id,
        });
        res.json(post);
    }catch(err){
        res.json(err);
    }
});

//on initialise le compte d'un user avec son folder_id unique
//permet juste de faire l'initialisation de l'account avec le folder_id et une liste de contrats vide
router.post('/init',async (req,res)=>{
    const post = new AccountModel({
        folder_id : req.body.folder_id
    });
    try{   
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message:err});
    }
});

//patch permet de modifer partielement sans ecraser l'objet
//1) post pour créer un contrat
//on utilise un params pour identifier le contrat à modifier
//les informations à modifier sur le contrat seront communiquées
//par req.body : JSON
router.post('/contract/create',async (req,res)=>{
    try{
        const updatedPost = await AccountModel.updateOne({folder_id : req.body.folder_id},{
            //pour le $pull, $push j'ai trouvé sur la doc officielle
            //https://docs.mongodb.com/manual/reference/operator/update-array/
            $push : { listContract : {
                contract_id : uuidv4(),
                object : req.body.object,
                serialNumber : req.body.serialNumber,
                brand : req.body.brand,
                model : req.body.model,
                purchasePrice : req.body.purchasePrice,
                month_price : req.body.month_price,
                listWarranted :{
                    panne : false,
                    casse : false,
                    vol : false,
                    oxydation : false
                }
            }}
        });
        res.json(updatedPost);
    }catch(err){
        res.json(err);
    }
});






//delete an entire account with its folder_id
router.delete('/:folderPost',async (req,res)=>{
    try{
        const rmContract = await AccountModel.remove(
        {folder_id : req.params.folderPost}
        );
        res.json(rmContract);
    }catch(err){
        res.json(err);
    }
});

//delete all contracts from an account identified by folder_id
router.delete('/contract/all',async (req,res)=>{
    try{
        const rmContract = await AccountModel.updateOne(
        {folder_id : req.body.folder_id},
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
router.post('/contract/delete',async (req,res)=>{
    try{
        const rmContract = await AccountModel.update(
        {folder_id : req.body.folder_id},
        //https://docs.mongodb.com/manual/reference/operator/update/pull/
        {$pull : {listContract : {contract_id : req.body.contract_id} } 
        //le filtre est le contractId, tout le reste ne sera pas supp
        //pour faire le contraire utilise $in
    });
        res.json(rmContract);
    }catch(err){
        res.json(err);
    }
});

//update les garanties d'un contract indentifié par le folder_id et contract_id en req.body
//avec la liste des garanties passées en req.body
router.post('/contract/update',async (req,res)=>{
    try{
        const updateContract = await AccountModel.update(
            // ma query pour identifier le contract
        {
            folder_id : req.body.folder_id,
        },
        {
            $push:{
                "listWarranted.$.panne" : req.body.panne
            }
        }

        // explication elemMatch https://docs.mongodb.com/manual/reference/operator/update/positional/
        //     mon update
        // { $set : {
        //         "listWarranted.$.panne" : req.body.panne
        //         // "listWarranted.$.casse" : req.body.casse,
        //         // "listWarranted.$.vol" : req.body.vol,
        //         // "listWarranted.$.oxydation" : req.body.oxydation,
        //         }   
        //     }
        // )
        //{$push : {listWarranted :}}
        )
        res.json(updateContract);
    }catch(err){
        res.json(err);
    }
});

router.po
module.exports =router;