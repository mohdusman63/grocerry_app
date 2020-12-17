
const mongoose=require('mongoose')
const DriverSchema=new mongoose.Schema({
    is_profile_created:{
        type:Number,
        default:0

    },
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
        default:'driver'
    }
    ,is_otp_verify:{
        type:Number,
        default:0
    }
},

{timestamps:true}

)
const DriverModel=mongoose.model('drivers',DriverSchema)
module.exports=DriverModel
