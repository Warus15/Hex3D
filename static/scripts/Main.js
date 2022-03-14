$(document).ready(() => {
   const HEX_SIZE = {
      width: 116,
      height: 100
   };
   const deltaZ = 50;
   const deltaX = 25;

   let JSONData = {
      size: null,
      level: null
   };
   let hexes = new Array();
   let currentType = "wall";

   generateMap();

   $("#boardSize").on("change", () => {
      generateMap();
   });

   function generateMap() {
      boardSize = parseInt($("#boardSize").val());
      $("#jsonPreview").empty();
      $("#editor").empty();
      hexes = null;
      hexes = new Array();
      JSONData.size = null;
      JSONData.size = boardSize;
      JSONData.level = null;

      let ID = 0;
      let posX = 0;
      let posZ = 0;

      let increaseZ = false;

      for (let i = 0; i < boardSize; i++) {
         hexes[i] = new Array();

         for (let j = 0; j < boardSize; j++) {
            if (increaseZ) posZ += deltaZ;
            else if (j != 0) posZ -= deltaZ;

            let newDeltaX = 0;
            newDeltaX += deltaX;

            let newHex = new Hex(ID, posX, posZ, i, j, currentType);
            hexes[i][j] = newHex;

            $(newHex.desc.container).on("click", () => {
               newHex.desc.changeDesc();
               updateType(newHex.desc);
               updateDirIn(newHex.desc);
               newHex.desc.updateDesc();

               updateJSONPreview();
            });

            ID++;

            if (j % 2 == 0) increaseZ = true;
            else increaseZ = false;

            posX += HEX_SIZE.width - newDeltaX;
         }
         posX = 0;

         posZ += HEX_SIZE.height - deltaZ;
      }
   }

   function updateJSONPreview() {
      JSONData.level = null;
      JSONData.level = new Array();

      for (let i = 0; i < hexes.length; i++)
         for (let j = 0; j < hexes.length; j++)
            if (hexes[i][j].desc.info)
               JSONData.level.push(hexes[i][j].desc.info);

      $("#jsonPreview").html();
      $("#jsonPreview").html(JSON.stringify(JSONData, null, 5));
   }

   $("#wall").on("click", () => {
      currentType = "wall";
   });
   $("#treasure").on("click", () => {
      currentType = "treasure";
   });
   $("#light").on("click", () => {
      currentType = "light";
   });
   $("#enemy").on("click", () => {
      currentType = "enemy";
   });

   function updateType(desc) {
      desc.type = currentType;
   }

   function updateDirIn() {
      for (let i = 0; i < hexes.length; i++)
         for (let j = 0; j < hexes.length; j++) {
            let dirsIn = new Array();

            if (j % 2 == 0) {
               if (hexes[i])
                  if (hexes[i][j - 1])
                     if (hexes[i][j - 1].desc.info)
                        if (hexes[i][j - 1].desc.info.dirOut == 1)
                           dirsIn.push(4);

               if (hexes[i])
                  if (hexes[i][j + 1])
                     if (hexes[i][j + 1].desc.info)
                        if (hexes[i][j + 1].desc.info.dirOut == 5)
                           dirsIn.push(2);

               if (hexes[i - 1])
                  if (hexes[i - 1][j - 1])
                     if (hexes[i - 1][j - 1].desc.info)
                        if (hexes[i - 1][j - 1].desc.info.dirOut == 2)
                           dirsIn.push(5);

               if (hexes[i - 1])
                  if (hexes[i - 1][j + 1])
                     if (hexes[i - 1][j + 1].desc.info)
                        if (hexes[i - 1][j + 1].desc.info.dirOut == 4)
                           dirsIn.push(1);
            } else {
               if (hexes[i])
                  if (hexes[i][j - 1])
                     if (hexes[i][j - 1].desc.info)
                        if (hexes[i][j - 1].desc.info.dirOut == 2)
                           dirsIn.push(5);

               if (hexes[i])
                  if (hexes[i][j + 1])
                     if (hexes[i][j + 1].desc.info)
                        if (hexes[i][j + 1].desc.info.dirOut == 4)
                           dirsIn.push(1);

               if (hexes[i + 1])
                  if (hexes[i + 1][j - 1])
                     if (hexes[i + 1][j - 1].desc.info)
                        if (hexes[i + 1][j - 1].desc.info.dirOut == 1)
                           dirsIn.push(4);

               if (hexes[i + 1])
                  if (hexes[i + 1][j + 1])
                     if (hexes[i + 1][j + 1].desc.info)
                        if (hexes[i + 1][j + 1].desc.info.dirOut == 5)
                           dirsIn.push(2);
            }

            if (hexes[i - 1])
               if (hexes[i - 1][j])
                  if (hexes[i - 1][j].desc.info)
                     if (hexes[i - 1][j].desc.info.dirOut == 3) dirsIn.push(0);

            if (hexes[i + 1])
               if (hexes[i + 1][j])
                  if (hexes[i + 1][j].desc.info)
                     if (hexes[i + 1][j].desc.info.dirOut == 0) dirsIn.push(3);

            hexes[i][j].desc.dirsIn = dirsIn;
            hexes[i][j].desc.updateDesc();
         }
   }

   //Upload
   $("#saveLevel").on("click", () => {
      JSONData.levelName = $("#levelName").val();
      $("#levelName").val("");
      saveLevelOnServer();
      delete JSONData.levelName;
   });

   function saveLevelOnServer() {
      $.ajax({
         url: "/handleLevelUpload",
         data: JSONData,
         type: "POST",
         success: response => {
            console.log(response);
            window.alert(response);
         },
         error: (xhr, status, error) => {
            console.log(`ERROR OCCURED DURING SAVE`);
            console.log(`XHR: ${xhr}`);
            console.log(`STATUS: ${status}`);
            console.log(`ERROR: ${error}`);
         }
      });
   }

   // LOAD

   $("#screenCover").on("click", () => {
      hideCover();
   });

   $("#loadLevel").on("click", () => {
      $("#screenCover").css("display", "flex");
      getLevelsFromServer();
   });

   function getLevelsFromServer() {
      $.ajax({
         url: "/getLevelsNumber",
         type: "GET",
         success: response => {
            generateLevelsList(JSON.parse(response));
         },
         error: (xhr, status, error) => {
            console.log(`ERROR OCCURED DURING SAVE`);
            console.log(`XHR: ${xhr}`);
            console.log(`STATUS: ${status}`);
            console.log(`ERROR: ${error}`);
         }
      });
   }

   function generateLevelsList(response) {
      for (let i = 0; i < response.length; i++) {
         let newLevelsListElement = $("<div>");
         newLevelsListElement.addClass("levelsListElement");

         let newLevelsListElementID = $("<div>");
         newLevelsListElementID.addClass("levelsListElementID");
         newLevelsListElementID.html(`<h3>ID: ${response[i].LevelID}</h3>`);

         let newLevelsListElementName = $("<div>");
         newLevelsListElementName.addClass("levelsListElementName");
         newLevelsListElementName.html(
            `<h3>Name: ${response[i].LevelName}</h3>`
         );

         let newLevelsListElementDate = $("<div>");
         newLevelsListElementDate.addClass("levelsListElementDate");
         newLevelsListElementDate.html(
            `<h3>Save Date: ${response[i].SaveDate}</h3>`
         );

         newLevelsListElement.append(newLevelsListElementID);
         newLevelsListElement.append(newLevelsListElementName);
         newLevelsListElement.append(newLevelsListElementDate);

         newLevelsListElement.on("click", () => {
            getLevel(response[i].DatabaseLevelID, response => {
               drawMap(response);
            });
         });

         $("#screenCover").append(newLevelsListElement);
      }
   }

   function getLevel(ID, callback) {
      let levelID = { id: ID };

      $.ajax({
         url: "/getLevel",
         data: levelID,
         type: "POST",
         success: callback,
         error: (xhr, status, error) => {
            console.log(`ERROR OCCURED DURING SAVE`);
            console.log(`XHR: ${xhr}`);
            console.log(`STATUS: ${status}`);
            console.log(`ERROR: ${error}`);
         }
      });
   }

   function drawMap(response) {
      boardSize = parseInt(response.size);
      $("#jsonPreview").empty();
      $("#editor").empty();
      hexes = null;
      hexes = new Array();
      JSONData.size = null;
      JSONData.size = boardSize;
      JSONData.level = null;
      JSONData.level = response.level;

      let ID = 0;
      let posX = 0;
      let posZ = 0;

      let increaseZ = false;

      let loadedLevelArrayIndex = 0;

      for (let i = 0; i < boardSize; i++) {
         hexes[i] = new Array();

         for (let j = 0; j < boardSize; j++) {
            if (increaseZ) posZ += deltaZ;
            else if (j != 0) posZ -= deltaZ;

            let newDeltaX = 0;
            newDeltaX += deltaX;

            let newHex = new Hex(ID, posX, posZ, i, j, currentType);

            $(newHex.desc.container).on("click", () => {
               newHex.desc.changeDesc();
               updateType(newHex.desc);
               updateDirIn(newHex.desc);
               newHex.desc.updateDesc();

               updateJSONPreview();
            });

            //Lines that overwrite hex with data from loaded level
            if (ID == parseInt(response.level[loadedLevelArrayIndex].id)) {
               newHex.desc.info = {
                  id: parseInt(response.level[loadedLevelArrayIndex].id),
                  x: i,
                  z: j,
                  dirIn: null,
                  dirOut: parseInt(
                     response.level[loadedLevelArrayIndex].dirOut
                  ),
                  type: response.level[loadedLevelArrayIndex].type
               };

               newHex.desc.type = response.level[loadedLevelArrayIndex].type;

               if (response.level[loadedLevelArrayIndex].dirIn)
                  newHex.desc.dirsIn =
                     response.level[loadedLevelArrayIndex].dirIn;
               else newHex.desc.dirsIn = new Array();

               newHex.desc.currentDirection = parseInt(
                  response.level[loadedLevelArrayIndex].dirOut
               );
               newHex.desc.currentRotation = newHex.desc.currentDirection * 60;

               if (loadedLevelArrayIndex < response.level.length - 1)
                  loadedLevelArrayIndex++;

               newHex.desc.changeDesc();
            }
            //
            hexes[i][j] = newHex;

            ID++;

            if (j % 2 == 0) increaseZ = true;
            else increaseZ = false;

            posX += HEX_SIZE.width - newDeltaX;
         }
         posX = 0;

         posZ += HEX_SIZE.height - deltaZ;
      }
      updateJSONPreview();
   }

   function hideCover() {
      $("#screenCover").empty();
      $("#screenCover").css("display", "none");
   }

   //Open Buttons:

   $("#openHex3D").on("click", () => {
      window.location.href = "/hex";
   });

   $("#openGame").on("click", () => {
      window.location.href = "/game";
   });

   $("#openSimpleMovement").on("click", () => {
      window.location.href = "/player";
   });

   $("#openSimpleAllyMovement").on("click", () => {
      window.location.href = "/ally";
   });

   $("#openSimpleAlliesMovement").on("click", () => {
      window.location.href = "/allies";
   });

   $("#openAllyModelMovement").on("click", () => {
      window.location.href = "/allymodel";
   });
});
