class Hex3D {
   constructor(dirsIn, dirOut, x, z, type, scene) {
      this.sides = 6;
      this.radius = Settings.hexRadius;
      this.angle = 60;

      this.wallSize = (2 * this.radius) / Math.sqrt(3);
      this.wallGeometry = new THREE.BoxGeometry(
         this.wallSize,
         this.wallSize,
         this.wallSize / 10
      );
      this.wall = new THREE.Mesh(this.wallGeometry, Settings.hexWallMaterial);

      this.outerRadius = this.wallSize;

      this.container = new THREE.Object3D();
      this.containerPosX = null;
      this.containerPosZ = null;

      this.dirsIn = dirsIn;
      this.dirOut = dirOut;
      this.dirsInContainDirOut = false;
      this.doors = null;

      this.x = x;
      this.z = z;
      this.type = type;

      this.scene = scene;

      this.init();
   }

   init() {
      this.calculateCenter();
      this.fillDoors();
      this.generateFloor();
      this.generateSides();
      this.fillContainer();
   }

   calculateCenter() {
      if ((this.z & 1) == 0) {
         this.containerPosX = -2 * this.x * this.radius;
         this.containerPosZ = (this.z / 2) * 3 * this.outerRadius;
      } else {
         this.containerPosX = (-2 * this.x - 1) * this.radius;
         this.containerPosZ =
            ((this.z - 1) / 2) * 3 * this.outerRadius +
            this.radius * Math.sqrt(3);
      }

      this.container.position.set(
         this.containerPosX,
         this.wallSize / 4,
         this.containerPosZ
      );
   }

   fillDoors() {
      this.doors = new Array();
      this.dirsIn.forEach(dir => {
         this.doors.push(dir);
         if (dir == this.dirOut) this.dirsInContainDirOut = true;
      });
      if (!this.dirsInContainDirOut) this.doors.push(this.dirOut);
   }

   generateFloor() {
      let floor = new THREE.Mesh(
         new THREE.CylinderGeometry(this.outerRadius, this.outerRadius, 1, 6),
         Settings.hexFloorMaterial
      );
      floor.position.y -= this.wallSize / 4;
      floor.castShadow = true;
      floor.receiveShadow = true;
      this.container.add(floor);
   }

   generateSides() {
      for (let i = 0; i < this.sides; i++) {
         let side;

         if (!this.doors.includes(i)) {
            side = this.wall.clone();
            side.castShadow = true;
            side.receiveShadow = true;
         } else side = new Doors3D().getDoors();

         side.position.x =
            Math.cos(i * this.angle * (Math.PI / 180)) * this.radius;
         side.position.y += this.wallSize / 4;
         side.position.z =
            Math.sin(i * this.angle * (Math.PI / 180)) * this.radius;

         side.lookAt(0, this.wallSize / 4, 0);
         this.container.add(side);
      }
   }

   fillContainer() {
      switch (this.type) {
         case "wall":
            break;
         case "light":
            this.generateLight();
            break;
         case "treasure":
            this.generateTreasure();
            break;
         case "enemy":
            this.generateAlly();
            break;
         default:
            break;
      }
   }

   generateLight() {
      this.light = new Light3D();
      this.bulb = this.light.getLight();
      this.bulb.position.set(0, this.wallSize / 4, 0);
      this.container.add(this.bulb);
   }

   generateTreasure() {
      this.treasure = new Treasure3D();
      this.item = this.treasure.getTreasure();
      this.item.position.set(0, 0, 0);
      this.container.add(this.item);
   }

   async generateAlly() {
      this.ally = new AllyModel3D();

      await this.ally.loadModel();

      this.ally.position.set(
         this.containerPosX,
         this.wallSize / 4,
         this.containerPosZ
      );

      Settings.allies.push(this.ally);
      Settings.alliesMeshes.push(this.ally.model);

      this.scene.add(this.ally);
   }

   getHex() {
      return this.container;
   }
}
