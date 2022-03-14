class Model3D {
   constructor() {
      this.container = new THREE.Object3D();
      this.model = null;
      this.playerSpeed = 3;

      this.mixer = null;
      this.currentAnimation = null;

      this.POSITION_DIFFERENCE = 27;

      this.init();
   }

   init() {
      this.container.position.y =
         (2 * Settings.hexRadius) / Math.sqrt(3) / 4 + 10;

      // this.addAxis();
   }

   loadModel() {
      return new Promise((resolve, reject) => {
         let loader = new THREE.JSONLoader();
         loader.load("scripts/models/tris.js", geometry => {
            this.model = new THREE.Mesh(geometry, Settings.playerMaterial);
            this.model.name = "Player";
            this.model.rotation.y = 90;
            this.model.scale.set(1.3, 1.3, 1.3);
            this.model.castShadow = true;
            this.model.receiveShadow = true;

            this.mixer = new THREE.AnimationMixer(this.model);

            this.setAnimation("Stand");

            this.container.add(this.model);

            resolve(this.container);
         });
      });
   }

   moveModel(point) {
      let clickedVector = point;
      let directionVector = clickedVector
         .clone()
         .sub(this.container.position)
         .normalize();

      let distance = this.container.position.clone().distanceTo(clickedVector);

      let modelAngle = Math.atan2(
         this.container.position.clone().x - clickedVector.x,
         this.container.position.clone().z - clickedVector.z
      );

      if (distance - this.playerSpeed > this.POSITION_DIFFERENCE) {
         this.container.translateOnAxis(directionVector, this.playerSpeed);

         if (modelAngle) this.model.rotation.y = modelAngle - 90;

         this.container.position.y =
            (2 * Settings.hexRadius) / Math.sqrt(3) / 4 + 10;
      } else {
         if (this.currentAnimation != "Stand") this.setAnimation("Stand");
         Settings.activeAllies.forEach(ally => {
            if (ally.currentAnimation != "wave") ally.setAnimation("wave");
         });
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

   addAxis() {
      this.axes = new THREE.AxesHelper(20);
      this.container.add(this.axes);
   }
   rotateAxis(rotation) {
      let axisAngle = Math.atan2(
         rotation.x - this.container.position.clone().x,
         rotation.z - this.container.position.clone().z
      );

      this.axes.rotation.y = axisAngle;
   }
}
