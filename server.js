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
const app = express();
const authmiddleware = require("./middleware/authmiddleware");
const blogsRouter = require("./route/blogs");
const authRouter = require("./route/auth");
const cors = require("cors");

const createDB = require("./config/db");
createDB();

app.use(express.json());
app.use(cors(
    {
        origin: "*",
        credentials: true
    }
));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/blogs", blogsRouter);
app.use("/auth", authRouter);

app.get("/profile", authmiddleware, (req, res) => {
    res.status(200).json({ message: "Profile", userData: req.userData });
});

app.listen(process.env.PORT, () => {
    console.log(`"Server running at http://localhost:3000"${process.env.PORT}`);
});