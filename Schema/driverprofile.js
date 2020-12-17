const mongoose=require('mongoose')

var DriverProfileSchema=new mongoose.Schema({

    driver_id:{
         type:mongoose.Types.ObjectId,
           required:true

    },
  profile_pic:{
        type:String,
        required:true
    },
    driving_license_image:{
        type:String,
        required:true
    },
    driving_license_number:{   //1 true 0 false
        type:Number,
        required:true

    },
    vehicale_number:{
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
var DriverSetUpModel=mongoose.model('driverprofiles',DriverProfileSchema)
module.exports=DriverSetUpModel