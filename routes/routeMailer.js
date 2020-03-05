const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();
router.post('/send/validationLink', async (req, res) => {
    try {
        
        const intent = {
            subject: "",
            text: `Hello ${req.body.first_name} \n\nClick on this link to validate your account : http://localhost:3000/users/emailValidation/${req.body.folder}`
        };
        const envoi = emailSend(req.body.mail,intent);
        res.json(envoi);
    } catch (err) {
        res.json({
            err
        });
    }
});

// take in parameter user, intent (subject + text)
function emailSend(email,intent){
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
      to: email,
      subject: intent.subject,
      text: intent.text
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