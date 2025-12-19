const jwt = require("jsonwebtoken");
const auth = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

  
  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded)
    req.userData={id:decoded.id,email:decoded.email};
    next();
  }catch(err) {
    res.status(401).json({error:"unauthorized",message:err.message});
  }
}
module.exports = auth;