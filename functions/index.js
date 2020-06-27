const functions = require('firebase-functions');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = require('twilio')(accountSid, authToken);
const axios = require('axios');

exports.sendDadJoke = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(
            'https://icanhazdadjoke.com/',
            { headers: { Accept: 'application/json' } }
        );
        const joke = response.data.joke;
        
        client.messages
            .create({
                body: joke,
                from: functions.config().twilio.twilionum,
                to: functions.config().twilio.mynum
            })
            .then(message => console.log(message.sid))
            .catch(err => console.log(err))
            
        res.send(joke);
    }
    catch(err) {
        res.send('There was an error sending your dad joke')
    }
})