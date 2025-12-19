const express=require("express");
const fs=require("fs");
const router=express.Router();


router.get("/",(req,res) => {
    const products=fs.readFileSync("data/products.json");
    res.json(JSON.parse(products));
});


router.get("/:id",(req,res) => {
    
    console.log("id = ",req.params.id)
    const products=JSON.parse(fs.readFileSync("data/products.json"));
    const product = products.find((p) => {
        return p.id === parseInt(req.params.id)
    })
    res.json(product);
});

router.post("/", (req, res) => {
    const products = JSON.parse(fs.readFileSync("data/products.json"));
    const newProduct = {
        id:products[products.length-1].id+1,
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
    }

    const updatedProducts=[...products,newProduct];
    fs.writeFileSync("data/products.json",JSON.stringify(updatedProducts,null,2));
    res.status(201).json({message:"Product created successfuly"});

})



router.delete("/:id", (req, res) => {
    const data = fs.readFileSync("products.json", "utf8");
    const products = JSON.parse(data);
    const updatedProducts = products.filter(p => p.id !== parseInt(req.params.id));
    fs.writeFileSync("products.json", JSON.stringify(updatedProducts, null, 2));
    res.status(200).json({ message: "Product deleted successfully" });
});

module.exports=router;
