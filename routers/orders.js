const {Order} = require('../models/order');
const {OrderItem} = require ('../models/order-item')
const express = require('express');
const router = express.Router();

router.get(`/`, async(req, res)=>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    if(!orderList ){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send(orderList );
});

router.get(`/:id`, async(req, res, err)=>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
        path:'orderItems', populate: {
            path: 'product', populate:'category'} 
        });
    if(!order ){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send(order );
});

router.post('/', async(req, res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b)=> a +b, 0);
    console.log(totalPrice)

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
    })
    order = await order.save();

    //check if order exist to catch error
    if(!order){
        return res.status(404).send('order cannot be created')
    }           
    res.status(200).send(order);
});

router.put('/:id', async(req, res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true}
    );
    //check if category exist to catch error
    if(!order){
        return res.status(404).send('order cannot be created')
    }           
    res.status(200).send(order);
    
})

router.delete('/:id', (req, res)=>{
    Order.findByIdAndDelete(req.params.id).then(async order =>{
        if (order){
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({
                success: true,
                message:` the order (${req.params.id}) is deleted`
            })
        } else{
            return res.status(404).json({
                success: false,
                message: `order (${req.params.id}) not found`
            })
        }

    }).catch((err)=>{
        
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

//gettiing the overall sales price using mongoose.
router.get('/get/totalsales', async (req, res )=>{
    const totalSales = await Order.aggregate([
        {$group: { _id: null, totalsales : { $sum : '$totalPrice'}}}
    ]);

    if(!totalSales){
        return res.status(400).send('The order sales cannot be generated');
    } else{
        //since mongooese cannot do without (id), pop was used to only populate totalsales alone
        res.status(200).json({totalsales:totalSales.pop().totalsales})
    }
})

router.get(`/get/count`, async(req, res)=>{
    const orderCount = await Order.countDocuments().then((count)=> count);

    if(!orderCount){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send({orderCount: orderCount});
});

//get overall order by  a user
router.get(`/get/userorders/:userid`, async(req, res )=>{
    const userOrderList = await Order.find({user : req.params.userid})
    .populate({
        path:'orderItems', populate: {
            path: 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});
    if(!userOrderList ){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.send(userOrderList );
});


module.exports = router;