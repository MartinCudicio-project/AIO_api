const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    folder_id : {
        //un numero de compte qui est obligatoire
        type : String,
        require : true
    },
    listContrat : [{
        contract_id : String,
        object : String,
        month_price : Number,
        date_enroll : {
            type : Date,
            default : Date.now
        },
        listWarranted :[{
            title : String,
            description : String,
            rate : Number,
        }]
    }],
    contract : {
        contract_id : String,
        object : String,
        month_price : Number,
        date_enroll : {
            type : Date,
            default : Date.now
        },
        listWarranted :[{
            title : String,
            description : String,
            rate : Number
        }]
    }
});

module.exports = mongoose.model('account',PostSchema);