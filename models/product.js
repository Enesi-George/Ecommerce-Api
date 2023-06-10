const mongoose = require('mongoose'); // the const is used before running the server


//Creating a mongodbSchema for the database
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    }, 
    description:{
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        require: false,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    images: [{
        type: String
    }],
    brand:{
        type: String,
        default: '',
    },
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    rating:{
        type: Number,
        default: 0,
    },
    numReviews:{
        type: Number,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 225
    },
    isFeatured:{
        type: Boolean,
        default: false,
    },
    dateCreated:{
        type: Date,
        default: Date.now,
    }
});

//creating a virtual id instead of (_id)
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virutals: true,
})

//creating model for product
exports.Product = mongoose.model('Product', productSchema);