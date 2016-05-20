#Automailer

####Premise:
An entrepreneur friend of mine was collecting email addresses by hand to create a customer base. He was collecting the emails on a piece of paper and sending them emails when he could confirming the subscription.

Sending regular email to them also was a chore because of the process of logging in, typing up the email, cc limits etc.

####Solution:
Automailer will let one automate the process. It is mostly a basic api that will take name and email and register it to the list. An automatic email will be send notifying them of the subscription. When the time comes to send massive updates, a single message needs to be sent using the web portal and it will go to everyone on the list.

#####End points:

1. /users:
  GET: get all the users currently registered. No parameters required.
  
  POST: add a new user with urlencoded parameters name and email. Validation is not done by the API at the moment so that needs to be done on the front end.

2. /users/email:
  GET: get all the emails in the list. Basically eliminates the _id parameter.
