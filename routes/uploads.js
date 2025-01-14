const express = require("express");
const cloudinary = require('cloudinary').v2;
const {ProductModel} = require("../models/productModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();


// Configure Cloudinary using secrets
cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
});

router.get("/", async(req,res) => {
  res.json({msg:"Upload work"});
})

router.post("/product/:id",auth, async(req,res) => {
  try{
    const myFile = req.body.myFile;
    if(myFile){
      const data = await cloudinary.uploader.upload(myFile ,{ unique_filename:true})
      const id = req.params.id;
      const dataProduct = await ProductModel.updateOne({_id:id,user_id:req.tokenData._id},{img_url:data.secure_url})
      res.json(dataProduct)
      
    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/cloud_server", async(req,res) => {
  try{
    const myFile = req.body.myFile;
    if(myFile){
      const data = await cloudinary.uploader.upload(myFile ,{ unique_filename:true})
      res.json(data)

    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/cloud1", async(req,res) => {
  try{
    const myFile = req.files.myFile;
    if(myFile){
      const data = await cloudinary.uploader.upload(myFile.tempFilePath ,{ unique_filename:true})

      res.json(data)

    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;