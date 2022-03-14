class Light3D {
   constructor() {
      this.light;
      this.container = new THREE.Object3D();
      this.init();
   }

   init() {
      this.light = new THREE.PointLight(0xffffff, 0.5);
      this.light.castShadow = true;
      this.light.shadow.bias = -0.05;
      let bulb = new THREE.LineSegments(
         new THREE.SphereGeometry(Settings.hexRadius / 16, 32, 32),
         Settings.lightMaterial
      );

      this.container.add(bulb);
      this.container.add(this.light);
   }

   changeIntensity(intensity) {
      this.light.intensity = intensity;
   }

   getLight() {
      return this.container;
   }
}
