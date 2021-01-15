const mongoose=require('mongoose')

var CreateMatchSchema=new mongoose.Schema({
  team1_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    team2_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    match_type:{
       type:Number,
       required:true
    },

    created_at:
    {
         type: Date,
         default: Date.now,
    },
    updated_at:{
        type:Date,
        default:''
    }

},
    {  timestamps:true}




)
var CreateMatchModel=mongoose.model('creatematch',CreateMatchSchema)
module.exports=CreateMatchModel