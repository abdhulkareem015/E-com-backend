const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(201).json({message:"User created successfully",user});

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const loginUser = async (req,res) => {
    try{
        const { email,password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            res.status(400).json({error:"User not found"});
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            res.status(400).json({error:"Invalid Password"});
            return;
        }
        const token = jwt.sign({id: user._id, email: user.email},process.env.SECRET_KEY, {expiresIn:'1h'});
        res.status(200).json({message:"Login successfull",token});
    }catch(err){
        res.status(400).json({error:err.message});
    }
}

module.exports = {registerUser,loginUser};