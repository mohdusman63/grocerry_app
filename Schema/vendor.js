const mongoose=require('mongoose')
const VendorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_store_profile:{           //set value in vendor collection
          type:Number,
          default:0

    },
      is_product_profile:{
          type:Number,
          default:0

    },
    is_catalogue_profile:{

          type:Number,
          default:0

    },


    created_at:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Number,
        default:0
    }
    ,
    otp:{
        type:Number,
        default:null
    },
      updated_at:{
        type:String,
        default:''
    },
    account_type:{
        type:String,
        default:'vendor'
    },
    is_otp_verify:{
        type:Number,   //1 for verify 0 for not
        default:0
    }
},

{timestamps:true}

)
const VendorModel=mongoose.model('vendors',VendorSchema)
module.exports=VendorModel
