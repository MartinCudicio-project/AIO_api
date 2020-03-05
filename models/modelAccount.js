
//pour pouvoir mettre des objets dans des objets il faudra créer des sub-document
//https://mongoosejs.com/docs/subdocs.html - liens qui expliquent le principe
//la video est bien faite 0min à 20min il fait en mode projet simple
//apres il explique à quoi correspond les folder './models' et './routes' important de comprendre

const mongoose = require('mongoose');

const ContractSchema = mongoose.Schema({
    contract_id : String,
    object : String,
    brand : String,
    category : String,
    model : String,
    serialNumber : String,
    purchasePrice : Number,
    month_price : Number,
    bill_photo : String,
    imei : String,
    purchaseDate : {
        type : Date
    },
    listWarranted :{
        panne : Boolean,
        casse : Boolean,
        vol : Boolean,
        oxydation : Boolean
    },
    historyWarranted : [{
        panne : Boolean,
        casse : Boolean,
        vol : Boolean,
        oxydation : Boolean,
        modificationDate : Date
    }],
    isSinistered: Boolean,
    contractDate : Date

});

const AccountSchema = mongoose.Schema({
    folder_id : {
        //un numero de compte qui est obligatoire
        type : String,
        require : true
    },
    listContract : [ContractSchema]
});

module.exports = mongoose.model('account',AccountSchema);