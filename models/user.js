// const mongoose=require("mongoose");


// const userSchema=new mongoose.Schema(
//     {
//         name:{type:String,required:true},
//         age:{type:Number,required:true,min:5,max:18},
//         class:{type:Number,required:true,min:1,max:12},
//         roll_no:{type:Number,required:true,unique:true},
//     },
//     {timestamp:true}

// );
// module.exports=mongoose.model("User",userSchema);




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,required:true
        },
        password:{
            type:String,required:true
        },
        name:{
            type:String,
        },
    },
    
    {timestamps:true}
);

module.exports = mongoose.model("User",userSchema)