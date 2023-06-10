const mongoose = require('mongoose'); // the const is used before running the server


//Creating a mongodbSchema for the database
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        required: true,
    },
    street:{
        type: String,
        default: ""
    },
    apartment:{
        type: String,
        default:""
    },
    zip:{
        type: String,
        default:""
    },
    city:{

    },
    country:{
        type: String,
        default:""
    }
    
});

//for getting (id) instead of (_id, so as to use it more friendly
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

//creating model for user
exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;