const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct =async(req,res)=>{
    // get the user from the token (request)and assign it to schema as userId
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})

    res.send('createProduct')
}

const getAllProducts =async(req,res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length})
    
}
const getSingleProduct =async(req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findOne({_id:productId})
    if(!product ){
        throw new CustomError.NotFoundError(`no product with id :${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}
const updateProduct =async(req,res)=>{
    const {id:productId}=req.params;
    const product = await Product.findOneAndUpdate({__id:productId},req.body,{new:true,
    runValidators:true})
    if(!product ){
        throw new CustomError.NotFoundError(`no product with id :${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}
const deleteProduct =async(req,res)=>{

    const {id:productId} = req.params
    const product = await Product.findOne({_id:productId})
    if(!product ){
        throw new CustomError.NotFoundError(`no product with id :${productId}`)
    }
    await product.remove()
    res.status(StatusCodes.OK).json({msg:'success .product removed'})
}

const uploadImage =async(req,res)=>{
    res.send('uploadImage')
}

module.exports={
    createProduct,deleteProduct,getSingleProduct,
    getSingleProduct,getAllProducts,updateProduct,uploadImage}




