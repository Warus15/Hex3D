class Ring extends THREE.Mesh {
   constructor() {
      super(new THREE.RingGeometry(20, 25, 8), Settings.ringMaterial);
      return this;
   }
}
