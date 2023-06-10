function errorHandler(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        //jwt authentication error
        res.status(500).json({message:'this user is unauthorized'})
    };

    if(err.name === 'ValidationError'){
        // validation error
        res.status(401).json({message:err})
    }

    //default to 500 server error message
    return res.status(500).json({message: "internal server error", error: err})
};
module.exports = errorHandler;