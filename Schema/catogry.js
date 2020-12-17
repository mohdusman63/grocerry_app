const mongoose=require('mongoose')

var CatogrySchema=new mongoose.Schema({
  catogry_name:{
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
var CatogryModel=mongoose.model('catogries',CatogrySchema)
module.exports=CatogryModel