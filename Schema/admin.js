const mongoose=require('mongoose')

var AdminSchema=new mongoose.Schema({
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
var AdminModel=mongoose.model('admin',AdminSchema)
module.exports=AdminModel