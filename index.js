const express =require("express");
const app=express();
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const productRoute=require("./routes/product")
dotenv.config();
app.use(express.json());
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully")).catch((err)=>console.log(err))

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)

app.use("/api/products",productRoute)


app.listen(process.env.PORT||5000,()=>{
    console.log(`ther server is running`)
})