require("dotenv").config();

//Twilio sms message handling



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


client.messages
  .create({
     body: 'Your order is ready, please pick it up while it\'s hot! Your total is $25',
     from: '+18048852869', //valid Twilio number
     to: '+15148146278'
   })
  .then(message => console.log(message.sid));


