const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get(`/`, async(req, res)=>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send(userList);
});

router.get('/:id', async(req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    
    if(!user){
        res.status(500).json({message:`the category (${req.params.id}) is not found`})
    } 
    res.status(200).send(user);
})

router.post('/register', async(req, res)=>{

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password1, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment:req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    const newUser = await user;
    const userExist = await User.findOne({email: req.body.email});


    if(userExist){
        return res.status(400).json({
            message: "User already exists"
        })
    }
    if(newUser){
        newUser.save()
        return res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            message: "User Created Successfully"
        })
    }else{
        res.status(400).json({message: 'Invalid user data'})
    }


    //return res.status(200).send(user);
});

router.post('/login', async(req, res)=>{
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send("user not found")
    }
    
    //create a token for login authentication period
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId : user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )

        res.status(200).send(
            {
                message:"login successfully", 
                email: user.email,
                name: user.name, 
                token: token
            }
        )
    } else{
        res.status(400).send('password is wrong')
    }
})

router.get(`/get/count`, async(req, res)=>{
    const userCount = await User.countDocuments().then((count)=> count);

    if(!userCount){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send({userCount: userCount});
});

router.delete('/:id', (req, res)=>{
    User.findByIdAndDelete(req.params.id).then(user =>{
        if (user){
            return res.status(200).json({
                success: true,
                message:`The user (${req.params.id}) is deleted`
            })
        } else{
            return res.status(404).json({
                success: false,
                message: `user (${req.params.id}) not found`
            })
        }

    }).catch((err)=>{
        
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})


module.exports = router;