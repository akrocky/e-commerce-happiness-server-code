const router= require("express").Router();
const product = require("../models/Product");
const CryptoJS = require('crypto-js');
const { verifyToken, verfiyTokenAuthorization, verfiyTokenAndAdmin } = require("./verifyToken");
const Cart = require("../models/Cart");

// create
router.post("/",verifyToken, async (req,res)=>{
   const newCart= new Product(req.body)
   try{
const savedProduct= await newCart.save();
res.status(200).json(savedProduct)
   }catch(err){
       res.status(500).json(err)
   }
})
//update

router.put("/:id",verfiyTokenAuthorization, async (req,res)=>{

  
try{
    const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
    res.status(200).json(updatedProduct)
}catch(err){
res.status(500).json(err)
}
})
// delete
router.delete("/:id",verfiyTokenAuthorization,async(req,res)=>{
try{
 await Cart.findByIdAndDelete(req.params.id)
 res.status(200).json("product has been deleted")
}
catch(err){
res.status(500).json(err)
}

})
// // get User Cart
router.get("/find/:userId",verfiyTokenAuthorization,async(req,res)=>{
try{
const cart= await Cart.findOne({userId:req.params.userId})

res.status(200).json(cart)
}
catch(err){
res.status(500).json(err)
}

})
// // // Get alls

router.get("/",verfiyTokenAndAdmin,async(req,res)=>{
    try{
       const carts= await Cart.find();
       res.status(200).json(carts)

    }catch(err){res.status(500).json(err)}
})





module.exports=router