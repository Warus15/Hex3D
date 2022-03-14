class AllyTest3D extends THREE.Object3D {
   constructor() {
      super();

      this.mesh = null;
      this.axes = null;

      this.active = false;
      this.speed = 3;

      this.init();
   }

   init() {
      this.mesh = new THREE.Mesh(
         new THREE.SphereGeometry(30),
         new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
         })
      );

      this.axes = new THREE.AxesHelper(200);

      this.add(this.mesh);
      this.add(this.axes);
   }

   move(characterToFollowPosition) {
      let allyClickedVector = new THREE.Vector3(
         characterToFollowPosition.x,
         characterToFollowPosition.y + 10,
         characterToFollowPosition.z
      );

      let allyDirectionVector = allyClickedVector
         .clone()
         .sub(this.position)
         .normalize();

      let distance = this.position.clone().distanceTo(allyClickedVector);

      let allyAngle = Math.atan2(
         allyClickedVector.x - this.position.clone().x,
         allyClickedVector.z - this.position.clone().z
      );

      if (distance - this.speed >= 55) {
         this.translateOnAxis(allyDirectionVector, this.speed);

         if (allyAngle) {
            this.axes.rotation.y = allyAngle;
            this.mesh.rotation.y = allyAngle;
         }
      }
   }
}
