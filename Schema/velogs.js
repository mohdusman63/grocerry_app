const mongoose=require('mongoose')

var VelogsSchema=new mongoose.Schema({
   name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true
    },
     password:{
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
var VelogsModel=mongoose.model('velogs',VelogsSchema)
module.exports=VelogsModel