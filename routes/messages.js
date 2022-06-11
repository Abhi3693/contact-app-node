var express = require('express');
var router = express.Router();
var Message = require('../models/Message');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    let messages = await Message.aggregate([{ $sort: { updatedAt: -1 } }]);
    if (messages) {
      res.status(200).json({ messages: messages });
    } else {
      res.status(422).json({ error: 'Messages not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
