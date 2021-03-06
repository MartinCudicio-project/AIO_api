const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const appBaseUrl = "http://localhost:8080"

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

router.post('/send/createContract', async (req, res) => {
  try {
    const contract = req.body.contract
    const email = req.body.email
    const name = req.body.name
    var intent = {
        subject: "Création de votre contrat",
        text: `Bonjour ${name},
        Voici un récapitulatif de votre nouvelle subscription :
        Appareil : ${contract.object}
        Catégorie : ${contract.category}
        Marque : ${contract.brand}
        Model : ${contract.model}
        Numéro de série : ${contract.serialNumber}
        Prix d'achat : ${contract.purchasePrice}
        Prix mensuel : ${contract.month_price}\n`
    };
    if(contract.casse===true){
      intent.text+=`casse : oui\n`
    }
    if(contract.vol===true){
      intent.text+=`vol : oui\n`
    }
    if(contract.oxydation===true){
      intent.text+=`oxydation : oui\n`
    }
    const envoi = emailSend(email,intent);
    res.json(envoi);
  } catch (err) {
      res.json({
          err
      });
  }
});

router.post('/send/updatePassword', async (req, res) => {
  try {
      const intent = {
          subject: "AIO - modification de mot de passe",
          text: `Bonjour ${req.body.first_name},\n\nje vous informe que vous venez de changer votre mot de passe !`
      };
      const envoi = emailSend(req.body.email,intent);
      res.json(envoi);
  } catch (err) {
      res.json({
          err
      });
  }
});

router.post('/send/resetLink', async (req, res) => {
  try {
      const intent = {
          subject: "Réinitialisation du mot de passe",
          text: `Bonjour\n\nVoici votre mot de passe temporaire valable pendant 5 minutes : ${req.body.tempPassword}
      \n\nCliquez sur ce lien pour réinitialiser votre mot de passe: \n\n${appBaseUrl}/users/page/resetPassword`
      };
      const envoi = emailSend(req.body.email,intent);
      res.json(envoi);
  } catch (err) {
      res.json({
          err
      });
  }
});

router.post('/send/sinister', async (req, res) => {
  try{
    const intent = {
        subject: "Déclaration d'un sinistre",
        text: `Bonjour\n\nVoici Les informations du sinistre déclaré sur l'objet : ${req.body.sinister.object}\n\n
        Date du sinistre : ${req.body.sinister.sinisterDate}
        Heure du sinistre : ${req.body.sinister.sinisterTime}
        Circonstances du sinistre : ${req.body.sinister.sinisterCircumstances}
        Type de sinistre : ${req.body.sinister.sinisterType}`
    };
    const envoi = emailSend(req.body.email,intent);
    res.json(envoi);
  }
  catch (err) {
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