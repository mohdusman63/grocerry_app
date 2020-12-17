const mongoose=require('mongoose')

var AdminProductSchema=new mongoose.Schema({

  catogry_id:{
      type:mongoose.Types.ObjectId,
      required:true

  },
  image_array:{
      type:Array,
      required:true

  },
 product_name:{
      type:String,
      required:true
  },
  description:{
      type:String,
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
var AdminProductModel=mongoose.model('adminProducts',AdminProductSchema)
module.exports=AdminProductModel