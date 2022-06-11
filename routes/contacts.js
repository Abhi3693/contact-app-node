var express = require('express');
var router = express.Router();
var Contact = require('../models/Contact');
var Message = require('../models/Message');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Contact list
router.get('/', async (req, res, next) => {
  try {
    let allContacts = await Contact.find({});
    return res.status(200).json({ contacts: allContacts });
  } catch (error) {
    next(error);
  }
});

// Add Contact
router.post('/', async (req, res, next) => {
  let { firstName, lastName, phone } = req.body.contact;
  if (firstName && lastName && phone) {
    try {
      let contact = await Contact.create(req.body.contact);
      return res.status(200).json({ contact: contact });
    } catch (error) {
      next(error);
    }
  } else {
    return res
      .status(422)
      .json({ error: 'firstName, lastName and phone required' });
  }
});

// Single contact Info
router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  try {
    let contact = await Contact.findById(id);
    if (contact) {
      return res.status(200).json({ contact: contact });
    } else {
      return res.status(422).json({ error: 'Contact is not registerd' });
    }
  } catch (error) {
    next(error);
  }
});

// Message Form
router.post('/:id/message', async (req, res, next) => {
  let id = req.params.id;
  let otp = req.body.message.otp.split(':')[1];
  try {
    let contact = await Contact.findById(id);
    if (contact) {
      client.messages
        .create({
          body: req.body.message.otp,
          to: '+91' + contact.phone,
          from: '+18592176905',
        })
        .then(async (msg) => {
          let message = await Message.create({
            otp,
            contactID: contact.id,
            name: contact.firstName + ' ' + contact.lastName,
            phone: contact.phone,
          });
          return res.status(200).json({ message: message });
        })
        .catch((error) => {
          return res.status(422).json({ error: 'The number is unverified' });
        });
    } else {
      return res.status(422).json({ error: 'Contact is not registerd' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
