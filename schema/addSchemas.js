const mongoose = require('mongoose');


const addSchema = new mongoose.Schema({
  adId: {
    type: String,
  },

  userId: {
    type: String,
  },

  category: {
    type: String,
  },
  subcategory: {
    type: String,
  },
  brand: {
    type: String,

    required: true,
  },
  year: {
    type: String,

    required: true,
  },
  fuel: {
    type: String,

    required: true,
  },
  transmission: {
    type: String,

    required: true,
  },
  kmDriven: {
    type: String,

    required: true,
  },
  owners: {
    type: String,

    required: true,
  },
  title: {
    type: String,

    required: true,
  },
  description: {
    type: String,

    required: true,
  },
  location: {
    type: String,

    required: true,
  },
  price: {
    type: String,

    required: true,
  },
  image: {
    type: [String],

  },
}, { timestamps: true })
const adModels = mongoose.model('Ads', addSchema)
module.exports = adModels