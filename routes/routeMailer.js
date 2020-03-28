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
        const envoi = emailSend(req.body.email,intent);
        res.json(envoi);
    } catch (err) {
        res.json({
            err
        });
    }
});

router.post('/send/updateWarranted', async (req, res) => {
  try {
    var listWar = "";
    const contract = req.body
    // if(contract.panne)
    // {
    //   listWar+="la panne \n"
    // }
    if(contract.vol)
    {
      listWar+="le vol \n"
    }
    if(contract.casse)
    {
      listWar+="la casse \n"
    }
    if(contract.oxydation)
    {
      listWar+="l'oxydation \n"
    }
    const intent = {
        subject: "Modification of your warranted",
        text: `Hello ${contract.first_name} \n\nYou change today your warranted for your product '${contract.object}'.
        your product will be insured from the ${contract.m}/${contract.d} The guarantees contracted are :\n :
        ${listWar}`
    };
    const envoi = emailSend(contract.email,intent);
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
        pass: "bb|T-NJ`Se5o3]SB",
        
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