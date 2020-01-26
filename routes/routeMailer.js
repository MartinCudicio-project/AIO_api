const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();
router.post('/send/validationLink', async (req, res) => {
    try {
        const post = {
            first_name: req.body.first_name,
            mail: req.body.email,
            folder: req.body.folder
        };
        console.log(post);
        const envoi = emailSend(post);
        res.json(envoi);
    } catch (err) {
        res.json({
            err
        });
    }

});
function emailSend(post){
    var retour = false;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "confirmation.aio@gmail.com",
        pass: "bb|T-NJ`Se5o3]SB"
        //user: process.env.EMAIL,
        //pass: process.env.PASSWORD
      }
    });
    let mailOptions = {
      from: "confirmation.aio@gmail.com",
      to: post.mail,
      subject: "Confirm AIO Account",
      text: `Hello ${post.first_name} \n\nClick on this link to validate your account : http://localhost:3000/users/emailValidation/${post.folder}`
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.log("Error occurs", err);
      } else {
          retour = true;
        console.log("Email send");
      }
    });
    return retour;
  }
module.exports = router;