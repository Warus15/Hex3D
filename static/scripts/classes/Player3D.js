class Player3D {
   constructor() {
      this.container = new THREE.Object3D();
      this.player = null;
      this.axes = new THREE.AxesHelper(200);
      this.container.add(this.axes);

      this.init();
   }

   init() {
      this.player = new THREE.Mesh(
         new THREE.BoxGeometry(50, 50, 50),
         new THREE.MeshBasicMaterial({
            color: 0x0000aa,
            side: THREE.DoubleSide
         })
      );
      this.player.position.set(0, 25, 0);

      this.container.add(this.player);
   }

   getPlayer() {
      return this.container;
   }
   getPlayerMesh() {
      return this.player;
   }
}
