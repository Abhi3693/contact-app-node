let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema(
  {
    otp: { type: String, required: true },
    contactID: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  { timestamps: true }
);

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;
