const mongoose=require('mongoose')
const PlayerSchema=new mongoose.Schema({
    team_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    player_name:{
        type:String,
        required:true

    },
    role:{
         type:String,
        required:true
    },
    photo:{
        type:String,
        require:true,
    },
    is_played:{
        type:Number,
        default:0,

    },
    four:{
         type:Number,
        default:0,
      },
     six:{
          type:Number,
        default:0,

     } ,
     played_ball:{
          type:Number,
          default:0,
     },
     //if bowler
     bowler_bolled:{
          type:Number,
          default:0,
     },
     wicket:{
         type:Number,
          default:0,

     }


})
const PlayerModel=new mongoose.model('players',PlayerSchema)
module.exports=PlayerModel