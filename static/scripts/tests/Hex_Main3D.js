$(document).ready(() => {
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
   );
   const renderer = new THREE.WebGLRenderer();

   renderer.setClearColor(0x000000);
   renderer.setSize(window.innerWidth, window.innerHeight);
   camera.position.set(100, 100, 100);
   camera.lookAt(scene.position);

   $("#root").append(renderer.domElement);

   const axes = new THREE.AxesHelper(1000);
   scene.add(axes);

   const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
   orbitControl.update();

   ////
   let light = new THREE.AmbientLight(0xffffff, 0.7);
   scene.add(light);

   scene.add(new Hex3D([0], 3, 0, 0, "wall").getHex());
   ////

   function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
   }
   render();
});
