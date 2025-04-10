const mongoose = require('mongoose');

const adItemSchema = new mongoose.Schema({
  UserId: {
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
    year:{
        type: String,
       
        required: true,
      },
    fuel: {
        type: String,
        
        required: true,
      },
    transmission:{
        type: String,
      
        required: true,
      },
    kmDriven: {
        type: String,
        
        required: true,
      },
    owners:{
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
    price:{
        type: String,
        
        required: true,
      },
    image: {
      type: [String], 
        
      },
}, { timestamps: true })
const adModel=  mongoose.model('Ad', adItemSchema)
module.exports =adModel


