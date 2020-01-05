const mongoose = require('mongoose');

const InfoSchema = mongoose.Schema({
    brands : [{
        name : String,
        phones : [],
        touchPad : []
    }]
});

module.exports = mongoose.model('infos',InfoSchema);