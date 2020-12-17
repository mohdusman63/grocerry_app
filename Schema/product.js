const mongoose=require('mongoose')

var ProductSchema=new mongoose.Schema({
    catogry_id:{
           type:mongoose.Types.ObjectId,
           required:true
    },
  store_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    vendor_id:{
        type:mongoose.Types.ObjectId,
           required:true

    },
    product_name:{
        type:String,
        required:true
    },
    image_array:{
        type:Array,
        required:true
    },
    unit_price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true

    },
    discount:{
       type:Number,
       required:true
    },

    created_at:
    {
         type: Date,
         default: Date.now,
    },
    updated_at:{
        type:String,
        default:''
    }

},
    {  timestamps:true}




)
var ProductModel=mongoose.model('products',ProductSchema)
module.exports=ProductModel