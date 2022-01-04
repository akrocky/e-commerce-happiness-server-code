const router= require("express").Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js');
const { verifyToken, verfiyTokenAuthorization, verfiyTokenAndAdmin } = require("./verifyToken");



router.put("/:id",verfiyTokenAuthorization, async (req,res)=>{
    console.log(req.body,"from user");
   if(req.body.password){
    req.body.password= CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString()
   }
try{
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
    res.status(200).json(updatedUser)
}catch(err){
res.status(500).json(err)
}
})
// delete
router.delete("/:id",verfiyTokenAuthorization,async(req,res)=>{
try{
 await User.findByIdAndDelete(req.params.id)
 res.status(200).json("user has been deleted")
}
catch(err){
res.status(500).json(err)
}

})
// get user as an admin
router.get("/find/:id",verfiyTokenAndAdmin,async(req,res)=>{
try{
const user= await User.findById(req.params.id)
const {password,...others}=user._doc;
res.status(200).json(others)
}
catch(err){
res.status(500).json(err)
}

})
// // find all users as an admin
router.get("/",verfiyTokenAndAdmin,async(req,res)=>{
    const query=req.query.new
try{
const users= query?await User.find().sort({_id:-1}).limit(5):await User.find()

res.status(200).json(users)
}
catch(err){
res.status(500).json(err)
}

})

// //get user stats 
router.get("/stats",verfiyTokenAndAdmin,async (req,res)=>{
   const date= new Date();
   const lastYear =new Date(date.setFullYear(date.getFullYear()-1))
   try{
      const data= await User.aggregate([
          {$match:{createdAt:{$gte:lastYear}}},
          {
              $project:{
                 month:{$month:"$createdAt"} 
              }
          },
         {
             $group:{
              _id:"$month" ,
              total:{$sum:1}  
             }
         } 
      ])
      res.status(200).json(data)
   } catch(err){
       res.status(500).json(err)    
}
})


module.exports=router