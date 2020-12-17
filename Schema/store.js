const mongoose=require('mongoose')
const StoreSchema=new mongoose.Schema({


    vendor_id:{
         type:mongoose.Types.ObjectId,
         required:true
    },

    logo:{
        type:String,
        required:true
    },
    business_name:{
        type:String,
        required:true

    },
    business_phone:{
        type:Number,
        required:true

    },
    business_email:{
        type:String,
        required:true
    },
    business_address1:{
        type:String,
        required:true
    },
     business_address2:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
     state:{
        type:String,
        required:true
    },
     zip:{
        type:Number,
        required:true
    },
    country:{
        type:String,
        required:true
    },
     company_type:{
        type:String,
        required:true
    },
     business_catogry:{
        type:String,
        required:true
    },


     can_deliver:{
        type:String,
        default:'yes',
    },
     is_merchandise_digital:{
         type:String,
        default:'yes',
    },
    has_inventory_management_system:{
         type:String,
        default:'yes',
    },
     gst_number:{
        type:Number,
        required:true
    },
     gst_image:{
        type:String,
        default:0,
    },
      pan_number:{
        type:Number,
        default:0,
    },
      pan_image:{
        type:String,
        required:true
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
      updated_at:{
        type:String,
        default:''
    }
},
{timestamps:true}

)
const StoreModel=mongoose.model('stores',StoreSchema)
module.exports=StoreModel
