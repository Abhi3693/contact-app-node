let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let contactSchema = new Schema(
  {
    firstName: {
      type: String,
      require: [true, 'first name is required'],
      minLength: [3, 'first name should be at least three characters'],
    },
    lastName: {
      type: String,
      require: [true, 'last name is required'],
      minLength: [3, 'last name should be at least three characters'],
    },
    phone: {
      type: Number,
      require: [true, 'Phone required'],
      unique: [true, 'This Phone is taken.'],
    },
  },
  { timestamps: true }
);

let Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
