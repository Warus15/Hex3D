const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

const bodyParser = require("body-parser");
const DataBase = require("nedb");
const colors = require("colors");

let savedLevels = new DataBase({
   filename: "SavedLevels.db",
   autoload: true
});

let currentLevel;

app.use(bodyParser.urlencoded({ extended: true }));

//Requests
app.get("/", (req, res) => {
   savedLevels.find({}, (error, levels) => {
      if (error) {
         console.log(`ERROR OCCURED DURING GETTING LEVELS FROM DATABASE`.red);
         console.log(`ERROR: ${error}`.red);
      }

      levels.sort((a, b) => {
         return a.saveDateMs - b.saveDateMs;
      });

      currentLevel = levels[levels.length - 1]._id;
   });

   res.sendFile(`${__dirname}/static/index.html`);
});

app.get("/hex", (req, res) => {
   res.sendFile(`${__dirname}/static/sub/hex.html`);
});

app.get("/game", (req, res) => {
   res.sendFile(`${__dirname}/static/sub/game.html`);
});

app.get("/player", (req, res) => {
   res.sendFile(`${__dirname}/static/sub/simpleMovement.html`);
});

app.get("/ally", (req, res) => {
   res.sendFile(`${__dirname}/static/sub/simpleAllyMovement.html`);
});

app.get("/allies", (req, res) => {
   res.sendFile(`${__dirname}/static/sub/simpleAlliesMovement.html`);
});

app.get("/allymodel", (req, res) => {
   res.sendFile(`${__dirname}/static/sub/allyModelMovement.html`);
});

app.post("/handleLevelUpload", (req, res) => {
   let level = req.body;
   level.saveDateMs = new Date().getTime();
   level.saveDate = new Date().toLocaleString();

   savedLevels.insert(level, (error, data) => {
      if (error) {
         console.log(`ERROR OCCURED DURING INSERTING LEVEL INTO DATABASE`.red);
         console.log(`ERROR: ${error}`.red);
      }

      currentLevel = data._id;

      res.send("Level saved succesifuly");
   });
});

app.get("/getLevelsNumber", (req, res) => {
   savedLevels.find({}, (error, levels) => {
      if (error) {
         console.log(`ERROR OCCURED DURING GETTING LEVELS FROM DATABASE`.red);
         console.log(`ERROR: ${error}`.red);
      }

      levels.sort((a, b) => {
         return a.saveDateMs - b.saveDateMs;
      });

      let response = new Array();

      for (let i in levels) {
         response.push({
            LevelID: i,
            LevelName: levels[i].levelName,
            SaveDate: levels[i].saveDate,
            DatabaseLevelID: levels[i]._id
         });
      }

      res.send(JSON.stringify(response));
   });
});

app.post("/getLevel", (req, res) => {
   let id = req.body.id;
   currentLevel = id;

   savedLevels.findOne({ _id: id }, (error, level) => {
      if (error) {
         console.log(`ERROR OCCURED DURING GETTING LEVEL FROM DATABASE`.red);
         console.log(`ERROR: ${error}`.red);
      }

      res.send(level);
   });
});

app.post("/get3DLevel", (req, res) => {
   savedLevels.findOne({ _id: currentLevel }, (error, level) => {
      if (error) {
         console.log(`ERROR OCCURED DURING GETTING LEVEL FROM DATABASE`.red);
         console.log(`ERROR: ${error}`.red);
      }
      console.log(level);
      res.send(level);
   });
});

//Settings
app.use(express.static(`static`));

app.listen(PORT, () => {
   console.log("start serwera na porcie " + PORT);
});
