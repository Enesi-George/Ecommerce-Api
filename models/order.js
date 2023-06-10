const mongoose = require('mongoose'); // the const is used before running the server


//Creating a mongodbSchema for the database
const orderSchema = mongoose.Schema({
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1:{
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String,
    },
    city:{
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice:{
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    },

});

//creating a virtual id instead of (_id)
orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virutals: true,
})

//creating model for order
exports.Order = mongoose.model('Order', orderSchema);