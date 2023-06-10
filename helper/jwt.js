const { expressjwt: expressjwt } = require("express-jwt");
function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({ //this specify and allow authorization of a seleted api and url as seen below       
        path:[
            // {url: `${api}/products/`, methods: ['GET', 'OPTIONS']}, or using regular expression as below
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']}, //give me (i.e authorize) everything after the product
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']}, //give me (i.e authorize) everything after the product
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']}, //give me (i.e authorize) everything after the product
            `${api}/users/login`,//allowing users to access the page
            `${api}/users/register`//allowing new user to register
        ]
    })
}
async function isRevoked(req, token){
    if(!token.payload.isAdmin) {
       return true;
    }
}

module.exports = authJwt;