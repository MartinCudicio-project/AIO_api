const jwt = require('jsonwebtoken');
const User = require('../models/modelUser');
const SuperUser = require('../models/modelSuperUser');
const JWT_KEY = "WinterIsComing2019";

//ce middleware explication à
//https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122

const auth = async(req, res, next) => {
   
    const token = req.headers.authorization.split(' ')[1];
    const data = jwt.verify(token, JWT_KEY)
    try {
        let user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            user = await SuperUser.findOne({ _id: data._id, 'tokens.token': token })
            if (!user) {
                throw new Error()
            }
            req.user = user
            req.token = token
            next()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth