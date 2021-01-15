const mongoose = require("mongoose");
var BatsmanSchema = new mongoose.Schema({
  player: {
     type:Array,
     required:true
  },
})


var ScoreCardmodel = mongoose.model("scorecards", BatsmanSchema);
module.exports = ScoreCardmodel;
 