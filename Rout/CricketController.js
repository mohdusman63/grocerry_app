require("dotenv").config();
const express = require("express");
const app = express();
const Team = require("../Schema/createTeam");
const Player = require("../Schema/addPlayer");
const { Validator } = require("node-input-validator");
const bodyParser = require("body-parser");
const router = express.Router();
var multer = require("multer");
const mongoose = require("mongoose");
const CreateMatch = require("../Schema/creatematch");
const ScoreCard = require("../Schema/scorecard");
const Test = require("../Schema/test");
const { json } = require("express");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./image/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});
router.post("/createTeam", async (req, res) => {
  try {
    let v = await new Validator(req.body, {
      team_name: "required",
    });
    let check = await v.check();
    let team_name = v.errors.team_name ? v.errors.team_name.message : ",";
    if (!check) {
      res.status(422).json({
        statusCode: "422",
        message: team_name,
      });
    } else {
      let insert = {
        team_name: req.body.team_name,
      };
      let duplicate = await Team.find({
        team_name: req.body.team_name,
      });
      if (duplicate.length > 0) {
        res.status(400).json({
          statusCode: 400,
          message: "already exist",
        });
        return;
      }
      await Team.create(insert)
        .then((data) => {
          console.log(data);
          res.status(200).json({
            statusCode: 200,
            message: "team name added",
            details: data,
          });
        })
        .catch((e) => {
          console.log(e);

          res.status(500).json({
            statusCode: 500,
            message: "internal server error",
            error: e.message,
          });
        });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      statusCode: 400,
      message: "somrthing went wrong",
    });
  }
});

//fetch  total team shows in dropdown
router.get("/fetchTeam", async (req, res) => {
  try {
    let fetch = await Team.find(
      {},
      {
        team_name: 1,
        _id: 1,
      }
    );
    if (fetch) {
      res.status(200).json({
        statusCode: 200,
        message: fetch,
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "fetching proble",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
    });
  }
});
//adding a player in a list
router.post("/addPlayer", upload.single("photo"), async (req, res) => {
  try {
    let v = await new Validator(req.body, {
      team_id: "required",
      player_name: "required",
      role: "required",
    });
    let check = await v.check();
    let team_id = v.errors.team_id ? v.errors.team_id.message : ",";
    let player_name = v.errors.player_name ? v.errors.player_name.message : ",";
    let role = v.errors.role ? v.errors.role.message : ",";
    if (!check) {
      res.status(422).json({
        statusCode: 422,
        message: team_id + player_name + role,
      });
    } else {
      let duplicate = await Player.findOne({
        player_name: req.body.player_name,
      });
      if (duplicate) {
        res.status(400).json({
          statusCode: 400,
          message: "duplicate player_name",
        });
        return;
      }
      //let check length of player
      let l = await Player.find({
        team_id: req.body.team_id,
      });
      console.log(l.length);
      let len = l.length;
      if (len > 11) {
        res.status(400).json({
          statusCode: 400,
          message: "only 11 plyer can added",
        });
        return;
      }
      const insertData = {
        photo: req.file.filename,
        team_id: req.body.team_id,
        player_name: req.body.player_name,
        role: req.body.role,
      };
      console.log(insertData);
      await Player.create(insertData)
        .then((data) => {
          console.log(data);
          res.status(200).json({
            statusCode: 200,
            message: "player added sucessfully",
            length: len,
            details: data,
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({
            statusCode: 500,
            message: "server error",
            error: e.message,
          });
        });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
    });
  }
});
//fetch the player list on behalf of team_id
router.post("/getPlayerList", async (req, res) => {
  try {
    let v = await new Validator(req.body, {
      team_id: "required",
    });
    let check = await v.check();
    let team_id = v.errors.team_id ? v.errors.team_id.message : ",";
    if (!check) {
      res.status(422).json({
        statusCode: 422,
        message: team_id,
      });
    } else {
      console.log(req.body.team_id);
      let team_id = req.body.team_id;
      let findPlayer = await Player.find({
        team_id: req.body.team_id,
      });
      console.log(findPlayer.length);
      if (findPlayer.length === 0)
        return res.status(400).json({
          statusCode: 400,
          message: "no players found ",
        });

      let get = await Team.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(team_id),
          },
        },
        {
          $lookup: {
            from: "players",
            localField: "_id",
            foreignField: "team_id",
            as: "details",
          },
        },
        {
          $unwind: {
            path: "$details",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: "$details.player_name",
            player_id: "$details._id",
          },
        },
      ]);
      if (get.length === 0) {
        res.status(404).json({
          statusCode: 404,
          message: "no players exist",
        });
        return;
      }

      res.status(200).json({
        statusCode: 200,
        player_list: get,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
    });
  }
});
//create match
router.post("/createMatch", async (req, res) => {
  try {
    let v = await new Validator(req.body, {
      team1_id: "required",
      team2_id: "required",
      location: "required",
      match_type: "required",
    });
    let check = await v.check();
    let team1_id = v.errors.team1_id ? v.errors.team1_id.message : ",";
    let team2_id = v.errors.team2_id ? v.errors.team2_id.message : ",";
    let location = v.errors.location ? v.errors.location.message : ",";
    let match_type = v.errors.match_type ? v.errors.match_type.message : ",";
    if (!check) {
      res.status(422).json({
        statusCode: 422,
        message: team1_id + team2_id + location + match_type,
      });
    } else {
      const insertData = {
        team1_id: req.body.team1_id,
        team2_id: req.body.team2_id,
        location: req.body.location,
        match_type: req.body.match_type,
      };
      CreateMatch.create(insertData)
        .then((data) => {
          console.log(data);
          res.status(200).json({
            statusCode: 200,
            message: "match created sucessfully",
            match_details: data,
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({
            statusCode: 500,
            message: "db errors",
            error: e.message,
          });
        });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
    });
  }
});

async function updateBatsman(player_id, four, six, ballPlayed, res) {
  let checkExist = await Player.findOne({
    _id: player_id,
  });
  // console.log(checkExist)
  if (!checkExist) {
    console.log("not exist");
    return false;
  }
  //console.log(checkExist.is_played,checkExist.four,checkExist.six,checkExist.played_ball)
  let is_played = checkExist.is_played;
  let fours = checkExist.four + four;
  let sixe = checkExist.six + six;
  let played_balls = checkExist.played_ball + ballPlayed;
  let updatePlayer = await Player.updateOne(
    {
      _id: player_id,
    },
    {
      $set: {
        is_played: 1,
        four: fours,
        six: sixe,
        played_ball: played_balls,
      },
    }
  );
  // console.log(updatePlayer)
  let get = await Player.findOne({
    _id: player_id,
  });
  // console.log(get)

  return true;
}

router.post("/scoreboard", async (req, res) => {
  try {
    //console.log(req.body.batsman.length);
    let arr = [],
      ids = []; //to store the batsman id
    let l = req.body.batsman.length;
    for (let i = 0; i < l; i++) {
      ids.push(req.body.batsman[i].player_id); //store the id of batsman
      arr.push({
        id: req.body.batsman[i].player_id,
        four: req.body.batsman[i].four,
        six: req.body.batsman[i].six,
        played_ball: req.body.batsman[i].played_ball,
      });
    }
    console.log(arr[0].id);
    //   res.json(arr);
    //to check the whether the player is present in scorebord or not
    let count = 0;
    let get = await ScoreCard.findOne({ match_id: req.body.match_id }); //match id =.....

    if (get.batsman.length === 2) {
      // console.log(get.batsman.length);
      // if length is 2 then not need to insert update it
      for (const id of ids) {
        let fours, sixe, played_balls;
        //fetched the batsman
        let p = await Player.findOne({ _id: id });
        fours = arr[count].four; //req.body
        sixe = arr[count].six; //req.body
        played_balls = arr[count].played_ball;
        // console.log(fours, sixe);
        console.log("======>");
        count++;
        //console.log(p.four, p.six, p.played_ball, p.bowler_bolled, p.wicket); //db value
        console.log("<======");
        let update = await Player.updateOne(
          { _id: id },
          {
            $set: {
              is_played: 1,
              four: p.four + fours,
              six: p.six + sixe,
              played_ball: p.played_ball + played_balls,
            },
          }
        );
        res.status(200).json({
          statusCode: 200,
          message: "updated sucessfully",
        });
      }
    } else {
      //create

      const insertData = {
        match_id: req.body.match_id,
        batsman: req.body.batsman,
        bowler: req.body.bowler,
        over_details: req.body.over_details,
      };

      console.log(insertData);
      ScoreCard.create(insertData)
        .then((data) => {
          console.log(data);
          res
            .status(200)
            .json({ statusCode: 200, message: "score added", "data is": data });
        })
        .catch((e) => {
          console.log(e.message);
          res.status(500).json({
            statusCode: 500,
            message: "db error",
            error: e.message,
          });
        });
    }
  } catch (e) {
    console.log(e);
    // res.status(400).json({
    //   statusCode: 400,
    //   message: "something went wrong",
    // });
  }
});

//add a new player in existing scoreard push is used

router.post("/addDeletedPlayer", async (req, res) => {
  try {
    console.log(req.body.match_id);
    let get = await ScoreCard.updateOne(
      { match_id: req.body.match_id },
      {
        $push: {
          batsman: {
            player_id: req.body.player_id,
            four: req.body.four,
            six: req.body.six,
            played_ball: req.body.played_ball,
          },
        },
      }
    );
    console.log(get);
  } catch (e) {}
});

//delete a nested documnets using pull
router.post("/deletePlayer", async (req, res) => {
  try {
    console.log(req.body);
    let u = await ScoreCard.updateOne(
      { match_id: req.body.match_id },
      {
        $pull: {
          batsman: {
            player_id: req.body.player_id,
          },
        },
      }
      //  { multi: true}          //multiple value
    );
    console.log(u);
  } catch (e) {}
});
module.exports = router;
