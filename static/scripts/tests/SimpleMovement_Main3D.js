$(document).ready(() => {
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
   );
   const renderer = new THREE.WebGLRenderer();

   setOptions();

   ///////////////////////////////////////////////////////
   setGrid();

   let player;
   let playerSpeed;
   addPlayer();

   const raycaster = new THREE.Raycaster();
   const mouseVector = new THREE.Vector2();
   let clickedVector = new THREE.Vector3(0, 0, 0);
   let directionVector = new THREE.Vector3(0, 0, 0);
   setRaycaster();

   let mouseDown = false;

   let pointer = new THREE.LineSegments(
      new THREE.SphereGeometry(5, 32, 32),
      new THREE.LineBasicMaterial({
         color: 0xff0000
      })
   );
   scene.add(pointer);
   pointer.visible = false;

   let clickedPoint = new THREE.Vector3(0, 0, 0);
   let angle;
   ///////////////////////////////////////////////////////

   render();

   //Functions
   function render() {
      castRaycaster();

      requestAnimationFrame(render);
      renderer.render(scene, camera);
   }

   function setOptions() {
      renderer.setClearColor(0xffffff);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.set(-500, 500, 500);
      camera.lookAt(scene.position);

      $("#root").append(renderer.domElement);

      const axes = new THREE.AxesHelper(1000);
      scene.add(axes);

      //const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
      //orbitControl.update();
   }

   function setGrid() {
      let floor = new THREE.Mesh(
         new THREE.PlaneGeometry(1500, 1500, 20, 20),
         new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            wireframe: true
         })
      );
      floor.rotateX(Math.PI / 2);
      scene.add(floor);
   }

   function addPlayer() {
      player = new Player3D();
      player.container.position.set(0, 25, 0);
      playerSpeed = 3;
      scene.add(player.container);
   }

   function setRaycaster() {
      $(document)
         .mousedown(event => {
            pointer.visible = true;
            mouseDown = true;

            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
         })
         .mouseup(event => {
            pointer.visible = false;
            mouseDown = false;
         })
         .mousemove(event => {
            if (mouseDown) {
               mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
               mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            }
         });
   }

   function castRaycaster() {
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0 && mouseDown) {
         clickedPoint = intersects[0].point;
      }
      placePointer(clickedPoint);
      movePlayer(clickedPoint);
   }

   function placePointer(point) {
      pointer.position.set(point.x, 0, point.z);
   }

   function movePlayer(point) {
      clickedVector = point;
      directionVector = clickedVector
         .clone()
         .sub(player.container.position)
         .normalize();

      let distance = player.container.position
         .clone()
         .distanceTo(clickedVector);

      angle = Math.atan2(
         clickedVector.x - player.container.position.clone().x,
         clickedVector.z - player.container.position.clone().z
      );

      if (distance - playerSpeed >= 0) {
         player.container.translateOnAxis(directionVector, playerSpeed);

         if (angle) {
            player.axes.rotation.y = angle;
            player.player.rotation.y = angle;
         }

         camera.position.set(
            player.container.position.x,
            player.container.position.y + 500,
            player.container.position.z + 500
         );

         camera.lookAt(player.container.position);
      }
   }
});
