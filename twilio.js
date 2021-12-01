require("dotenv").config();

//Twilio sms message handling

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

console.log(accountSid)
client.messages
  .create({
     body: 'Your order is ready, please pick it up while it\'s hot! Your total is $25',
     from: '+18022558617', //valid Twilio number
     //to: '+14379896701'
     to: '+16478741655'
   })
  .then(message => console.log(message.sid));

