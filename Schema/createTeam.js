const mongoose=require('mongoose')
const TeamSchema=new mongoose.Schema({
    team_name:{
        type:String,
        required:true
    }


})
const TeamModel=new mongoose.model('team',TeamSchema)
module.exports=TeamModel