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
      'email': email
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
  var subject = req.body.subject;
  var message = req.body.message;
  var errors = [];

  if(!subject){
    errors.push('No subject');
  }

  if(!message){
    errors.push('No message');
  }

  var db = req.db;
  var users = db.collection('addresses');
  users.find({}, function(err, items){
    if(!err){
      var result = [];
      for(var i = 0; i < items.lenght; i++){
        result.push({
          email: items[i].email,
          'subject': subject,
          'message': message
        });
      }
    } else {
      res.send({
        summary: 'emails could not be sent',
        errors: []
      });
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
        email: items[i].email
      }
      emails.push(user);
    }
    res.send(emails);
  });

});

module.exports = router;
