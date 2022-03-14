class Doors3D {
   constructor() {
      this.parts = 3;
      this.wallHeight = (2 * Settings.hexRadius) / Math.sqrt(3);
      this.wallWidth = (2 * Settings.hexRadius) / Math.sqrt(3) / 3;
      this.wallGeometry = new THREE.BoxGeometry(
         this.wallWidth,
         this.wallHeight,
         this.wallHeight / 10
      );
      this.wall = new THREE.Mesh(this.wallGeometry, Settings.hexWallMaterial);

      this.container = new THREE.Object3D();
      this.container.position.set(0, 0, 0);
      this.init();
   }
   init() {
      let startingX = -(this.wallHeight / 3);
      for (let i = 0; i < this.parts; i++) {
         if (i != 1) {
            let side = this.wall.clone();
            side.position.x = startingX + i * this.wallWidth;
            // side.castShadow = true;
            side.receiveShadow = true;
            this.container.add(side);
         }
      }
   }

   getDoors() {
      return this.container;
   }
}
