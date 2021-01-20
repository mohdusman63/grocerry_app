const mongoose = require("mongoose");
const num = {
  type: Number,
  required: true,
};
const id = {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
};
const batsmanSchema = mongoose.Schema({
  player_id: id,
  four: num,
  six: num,
  played_ball: num,
});
const bowlerSchema = mongoose.Schema({
  bowler_id: id,
  wicket: num,
  bowler_bolled: num,
});
const overSchema = mongoose.Schema({
  over: num,
  total_score: num,
});
var BatsmanSchema = new mongoose.Schema({
  match_id: id,
  batsman: [batsmanSchema],
  bowler: [bowlerSchema],
  over_details: [overSchema],
});

var ScoreCardmodel = mongoose.model("scorecards", BatsmanSchema);
module.exports = ScoreCardmodel;
