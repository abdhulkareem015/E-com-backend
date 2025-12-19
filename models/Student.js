const mongoose=require("mongoose");


const studentSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        age:{type:Number,required:true,min:5,max:18},
        class:{type:Number,required:true,min:1,max:12},
        roll_no:{type:Number,required:true,unique:true},
    },
    { timestamps: true }

);
module.exports=mongoose.model("Student",studentSchema);