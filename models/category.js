const mongoose = require('mongoose'); 


//Creating a mongodbSchema for the database
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon:{
        type: String,
    },
    color:{
        type: String,
    }
});

//creating model for product
exports.Category = mongoose.model('Category', categorySchema);