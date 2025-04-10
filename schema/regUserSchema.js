const mongoose = require('mongoose')
const regUserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
    required: true,
  },
  Image: {
    type: String,
  },

  FirstName: {
    type: String,
    required: true,

  },
  LastName: {
    type: String,
    required: true,

  },
  Address: {
    type: String,


  },
  Contact: {
    type: String,


  },
  Location: {
    type: String,


  },
  email: {
    type: String,
    required: true,
    unique: true,

  },

  password: {
    type: String,
    required: true,
    trim: true
  },

});

const user = mongoose.model("userModel", regUserSchema)
module.exports = user
