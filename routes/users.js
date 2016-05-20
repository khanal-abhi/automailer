var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var addresses = db.collection('addresses');
  addresses.find().toArray(function(err, items){
    res.send(items);
  });
});

/* POST a new user. */
router.post('/', function(req, res, next){
  var db = req.db;
  var username = req.body.name;
  var email = req.body.email;

  if (username && email){
    var user = {
      name: username,
      'email': email,
      subscribed: true
    };
    var addresses = db.collection('addresses');
    addresses.insert(user, function(err, result){
      if(!err){
        var formatted_message = {
          summary: 'Email added succesfully.',
          added_user: user
        }
        //TODO: send email confirmation the user
        res.send(formatted_message);
      }
    });
  } else {
    var errors = [];
    if(!username){
      errors.push('No username');
    }
    if(!email){
      errors.push('No email');
    }
    var result = {
      summary: 'Could not add the email.',
      'errors': errors
    };
    res.send(result);
  }

});

/* Use nodemailer to send the email to all the users */
router.post('/send-message', function(req, res, next){

  var errors = [];
  var subject = req.body.subject;
  var message = req.body.message;
  if(!subject){
    errors.push('No subject');
  }
  if(!message){
    errors.push('No message');
  }
  

  var db = req.db;
  var users = db.collection('addresses');
  users.find().toArray(function(err, items){
    if(!err){
      var result = [];
      var emailProps = require('../properties');
      var nodemailer = require('nodemailer');
      var transporter_url = 'smtps://' + emailProps.username + '%40gmail.com:' + emailProps.password + '@smtp.gmail.com';
      var transporter = nodemailer.createTransport(transporter_url);

      for(var i = 0; i < items.length; i++){
        if(items[i].subscribed){
          result.push(items[i].email);
          var mailOptions = {
            from: emailProps.from,
            to: items[i].email,
            'subject': subject,
            text: message
          }

          transporter.sendMail(mailOptions, function(err, info){
            if(err){
              console.log(err);
            }
          });

        }
      }

      res.send(result);
    } else {
      res.send({error: err});
    }
  });

});

/* GET all the emails in the list */
router.get('/emails', function(req, res, next){
  var db = req.db;
  var users = db.collection('addresses');
  users.find().toArray(function(err, items){
    var emails = [];
    for(var i = 0; i < items.length; i++){
      var user = {
        name: items[i].name,
        email: items[i].email,
        subscribed: items[i].subscribed
      }
      if(user.subscribed){
        emails.push(user);
      }
    }
    res.send(emails);
  });

});

/* Unsubscribe the user based on the email address */
router.post('/unsubscribe', function(req, res, next){
  var email = req.body.email;
  var db = req.db;
  var addresses = db.collection('addresses');
  addresses.update(
    {'email': email},
    {
      $set: {
        subscribed: false
      }
    },
    function(err, result){
      if(!err){
        console.log(result);
        if(result.result.ok == 1 && result.result.nModified > 0){
          res.send({
            summary: 'User unsubscribed',
            'email': email
          });
        } else {
          res.send({
            summary: 'User already unsubscribed or user not yet registered.',
            'email': email
          });
        }

      } else {
        res.send(err);
      }
    }
  );
});

module.exports = router;
