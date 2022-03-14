class AllyModel3D extends THREE.Object3D {
   constructor() {
      super();

      this.model = null;
      this.mixer = null;
      this.currentAnimation = null;

      this.axes = null;

      this.active = false;
      this.speed = 3;

      this.ring = null;

      // this.init();
   }

   init() {
      this.axes = new THREE.AxesHelper(200);
      this.add(this.axes);
   }

   loadModel() {
      return new Promise((resolve, reject) => {
         let loader = new THREE.JSONLoader();
         loader.load("scripts/models/ally.js", geometry => {
            this.model = new THREE.Mesh(geometry, Settings.allyMaterial);
            this.model.name = "Ally";
            this.model.rotation.y = 90;
            // this.scale.set(3, 3, 3);
            this.model.castShadow = true;
            this.model.receiveShadow = true;

            this.mixer = new THREE.AnimationMixer(this.model);
            this.setAnimation("wave");

            this.add(this.model);

            resolve(this);
         });
      });
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

      if (distance - this.speed > 50) {
         this.translateOnAxis(allyDirectionVector, this.speed);

         if (allyAngle) {
            // this.axes.rotation.y = allyAngle;
            this.model.rotation.y = allyAngle - 180;
         }
      }
   }

   setAnimation(animation) {
      if (this.currentAnimation)
         this.mixer.clipAction(this.currentAnimation).stop();

      this.mixer.clipAction(animation).play();
      this.currentAnimation = animation;
   }

   updateMixer(delta) {
      if (this.mixer) this.mixer.update(delta);
   }
}
