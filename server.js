// const http=require('http');

// const server=http.createServer((req,res)=>{
//     if(req.method==='GET' && req.url==='/'){
//         res.writeHead(202,{'Context-type':'application/json'});
//         res.end(JSON.stringify({message:"Helloo"}));
//     }
//     else if(req.method==='GET' && req.url==='/About'){
//         res.writeHead(202,{'Context-type':'application/json'});
//         res.end(JSON.stringify({message:"About"}));
//     }else{
//        res.writeHead(404,{'Context-type':'application/json'});
//         res.end(JSON.stringify({error:"Not Found"}));
//     }
// });

// server.listen(3000,()=>{
//      console.log('Server running at https://localhost/3000');


// })


/////////////////////////////////////////////////////
// const express=require("express");
// const fs=require("fs");
// const app=express();
// // app.use(express.json())
// const productsRouter=require('./route/products');
// const cartRouter=require('./route/cart');
// const cors=require("cors")

// app.use(express.json());
// app.use(cors());

// app.use((req,res,next)=>{
//     console.log(`${req.method}${req.url}`)
//     next();
// })

// app.get("/", (req, res) => {
//     res.json({ message: "Hello Express" });
// });

// app.get("/about", (req, res) => {
//     res.json({ message: "About" });
// });



// app.use("/products",productsRouter);
// app.use("/cart",cartRouter);


// app.listen(3000, () => { 
//     console.log('Server running at http://localhost:3000/');
// });

///////////////////////////////////////////////////////////////////

require('dotenv').config();
const express = require("express");
const fs=require("fs");
const app = express();
const cartRouter = require('./route/cart');
const ordersRouter = require('./route/orders');
const authmiddleware = require("./middleware/authmiddleware");
const productsRouter=require("./route/products");
const studentsRouter=require("./route/students");
const authRouter=require("./route/auth");
// const blogsRouter=require("./routes/blog");
const cors=require("cors");

const createDB=require("./config/db");
createDB();

app.use(express.json());      //middleware -> it is a process which is between request and respond
app.use(cors());

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`)
    next();                 //Pass to next middleware/route
})

app.use("/products",productsRouter)
app.use("/students",studentsRouter)
app.use("/auth",authRouter)
app.use('/cart', cartRouter); // Simple file-based cart
app.use('/orders', ordersRouter);

app.get("/profile", authmiddleware, (req,res) => {
    res.status(200).json({ message: "Profile",userData:req.userData });
}); // Simple file-based cart

// app.use("/blogs",blogsRouter)

app.listen(process.env.PORT, () => {
    console.log(`"Server running at http://localhost:3000"${process.env.PORT}`)
});