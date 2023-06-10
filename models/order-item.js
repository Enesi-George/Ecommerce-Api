const mongoose = require('mongoose');

//Creating a mongodbSchema for the database
const orderItemSchema = mongoose.Schema({
    quantity:{
        type : Number,
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

//creating model for order
exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);