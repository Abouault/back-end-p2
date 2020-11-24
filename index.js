require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer');
const cors = require('cors')

const PORT = process.env.PORT || 50100
const app = express()

console.log(process.env.GMAIL_ACCOUNT)

app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASS,
    }
});

app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
})

app.post('/contact', (req, res) => {
    if (req.query.apiKey !== process.env.API_KEY){
      res.status(401)
      res.json({error : 'wrong Api key'})
    }

    const {name, message, email} = req.body

    const mailOptions = {
        from: process.env.GMAIL_ACCOUNT,
        to: process.env.GMAIL_ACCOUNT,
        subject: `demande de contact de ${name}`,
        text: `${name} ${email} vous a envoyer une demande de contact : \n\n${message}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        res.sendStatus(500)
        } else {
          console.log('Email sent: ' + info.response);
          res.send('votre demande de contact a bien été envoyée')
        }
      });
})


