class Treasure3D {
   constructor() {
      this.treasure = null;

      this.init();
   }

   init() {
      this.treasure = new THREE.Mesh(
         new THREE.BoxGeometry(
            Settings.hexRadius / 2,
            Settings.hexRadius / 2,
            Settings.hexRadius / 2
         ),
         Settings.treasureMaterial
      );
      this.treasure.castShadow = true;
      this.treasure.receiveShadow = true;
   }

   getTreasure() {
      return this.treasure;
   }
}
