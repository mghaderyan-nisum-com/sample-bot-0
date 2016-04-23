var express = require('express');
var request = require("request");
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'i_am_awesome') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

var token = "EAAIVQLogQr8BAHnHKETJrsDTzt27LtUogQkWC87ytXkZAPHZB443qHM5tZCwAlo6xalIxiY3dyV5cVTTQKyNn0OeatwsY1XU0ZAdszXbxGJssL6gYOEjhWsmzZCSzZCjxVDd9YOmkJak9gQOrjsqHisXSeB7fBLvCWnjfG0zTbZCpUduZCNCHXdq";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.post('/webhook/', jsonParser, function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
