const {Product} = require('../models/product');
const {Category}= require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require ('multer');

//configuration of the type of image file
const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },

    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype]
            //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })


  router.get(`/`, async(req, res)=>{
    const productList = await Product.find().populate('category');

    if(!productList){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send(productList);
});

router.get(`/:id`, async(req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send(product);
});


router.post(`/`, uploadOptions.single('image'), async(req, res)=>{

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send("Invalid Category") 

    const file = req.file;
    if(!file) return res.status(400).send("Please select an image file") 

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.description,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,

    })

    const products = await product.save();

    if(!products){
        return res.status(500).send("Product cannot be created");
    }else{
        return res.status(200).send(products)
    }

   
});

router.put('/:id', async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("invalid product id requested")
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send("Invalid Category");


    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.description,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new: true}
    );
    //check if category exist to catch error
    if(!product){
        return res.status(404).send('product cannot be updated')
    }           
    res.status(200).send(product);
    
})

router.delete('/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id).then(product =>{
        if (product){
            return res.status(200).json({
                success: true,
                message:` the product (${req.params.id}) is deleted`
            })
        } else{
            return res.status(404).json({
                success: false,
                message: `product (${req.params.id}) not found`
            })
        }

    }).catch((err)=>{
        
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

router.get(`/get/count`, async(req, res)=>{
    const productCount = await Product.countDocuments().then((count)=> count);

    if(!productCount){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send({productCount: productCount});
});

router.get('/get/featured/:count', async(req, res)=>{
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(Number(count));

    if(!products) {
        res.status(500).json({success: false})
    }
    res.send(products);
})

router.put('/gallery-images/:id',uploadOptions.array('images', 10), async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("invalid product id requested")
    };
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files){
        files.map(file =>{
            imagesPaths.push(`${basePath}${file.filename}`);
        })
    }
    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        {new: true}
    );
    
    if(!product){
        return res.status(500).send("Product cannot be created");
    }else{
        return res.status(200).send(product)
    }

})

module.exports = router;