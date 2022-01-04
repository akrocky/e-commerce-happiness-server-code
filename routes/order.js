const router = require("express").Router();
const Order = require("../models/Order");
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verfiyTokenAuthorization,
  verfiyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/Order");

// create
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Product(req.body);
  try {
    const savedProduct = await newOrder.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update

router.put("/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete
router.delete("/:id", verfiyTokenAuthorization, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
// // get User Order
router.get("/find/:userId", verfiyTokenAuthorization, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});
// // // Get user orders

router.get("/", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get monthly income

router("/income",verfiyTokenAndAdmin,async(req,res)=>{
    const date= new Date();
   const lastMonth =new Date(date.setMonth(date.getMonth()-1))
   const priviousMonth =new Date(new Date().setMonth(lastMonth.getMonth()-1))
   try{
      const income= await User.aggregate([
          {$match:{createdAt:{$gte:priviousMonth}}},
          {
              $project:{
                 month:{$month:"$createdAt"} ,
                 sales:"$amount"
              }
          },
         {
             $group:{
              _id:"$month" ,
              total:{$sum:"$sales"}  
             }
         } 
      ])
      res.status(200).json(income)
   } catch(err){
       res.status(500).json(err)    
}
})

module.exports = router;
