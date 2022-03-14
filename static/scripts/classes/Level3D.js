class Level3D {
   constructor(scene) {
      this.levelData = null;
      this.level = null;

      this.scene = scene;

      this.light = null;
      this.bulb = null;

      this.rooms = new Array();
      this.lightRooms = new Array();
      this.floors = new Array();

      this.player = null;
      this.currentDestination = null;

      this.init();
   }

   async init() {
      await this.getData().then(data => {
         this.levelData = data;
         this.level = data.level;

         for (let i = 0; i < this.level.length; i++) {
            if (!this.level[i].dirIn) {
               this.level[i].dirIn = new Array();
            } else {
               for (let j = 0; j < this.level[i].dirIn.length; j++)
                  this.level[i].dirIn[j] = parseInt(this.level[i].dirIn[j]);
            }

            this.level[i].dirOut = parseInt(this.level[i].dirOut);
            this.level[i].x = parseInt(this.level[i].x);
            this.level[i].z = parseInt(this.level[i].z);
         }
      });

      this.generateLevel();
      this.getPlayer();
   }

   getData() {
      return new Promise((resolve, reject) => {
         $.ajax({
            url: "/get3DLevel",
            method: "POST",
            success: data => {
               resolve(data);
            },
            error: (xhr, status, error) => {
               console.log(`ERROR OCCURED DURING SAVE`);
               console.log(`XHR: ${xhr}`);
               console.log(`STATUS: ${status}`);
               console.log(`ERROR: ${error}`);
            }
         });
      });
   }

   generateLevel() {
      this.generateRooms();
      this.generateLight();
   }

   generateRooms() {
      for (let i = 0; i < this.level.length; i++) {
         let room = new Hex3D(
            this.level[i].dirIn,
            this.level[i].dirOut,
            this.level[i].x,
            this.level[i].z,
            this.level[i].type,
            this.scene
         );
         let hex = room.getHex();

         this.rooms.push(room);
         this.floors.push(room.container.children[0]);
         if (room.type == "light") this.lightRooms.push(room);

         this.scene.add(hex);
      }

      this.currentDestination = new THREE.Vector3(
         this.rooms[0].container.position.x,
         this.rooms[0].container.position.y,
         this.rooms[0].container.position.z
      );
   }

   generateLight() {
      this.light = new Light3D();
      this.light.changeIntensity(0.4);
      this.bulb = this.light.getLight();
      this.bulb.position.set(0, 500, 0);

      this.scene.add(this.bulb);
   }

   async getPlayer() {
      this.player = new Model3D();

      await this.player.loadModel().then(player => {
         player.position.set(
            this.rooms[0].container.position.x,
            this.rooms[0].container.position.y + this.rooms[0].wallSize / 4,
            this.rooms[0].container.position.z
         );
         this.scene.add(player);
      });
   }
}
