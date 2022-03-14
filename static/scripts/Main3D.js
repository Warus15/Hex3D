$(document).ready(async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  const renderer = new THREE.WebGLRenderer();

  $("#root").append(renderer.domElement);
  setOptions();

  ///////////////////////////////////////////////////////
  const TIMES = new Array();
  let fps;

  let clock = new THREE.Clock();
  ///////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////
  let level = new Level3D(scene);

  const ui = new Ui(level);

  const raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2();
  setRaycaster();

  let mouseDown = false;

  let pointer = new THREE.LineSegments(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.LineBasicMaterial({
      color: 0xff0000
    })
  );
  scene.add(pointer);
  pointer.visible = false;
  ///////////////////////////////////////////////////////

  render();

  //Functions
  function render() {
    let delta = clock.getDelta();

    if (level.player && level.player.model && level.currentDestination) {
      castRaycaster();
      setCameraToPlayer();
      level.player.updateMixer(delta);
    }

    if (Settings.allies.length > 0) {
      Settings.allies.forEach(ally => {
        ally.updateMixer(delta);
      });
    }

    countFps();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function setOptions() {
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.position.set(-500, 500, 500);
    camera.lookAt(scene.position);

    // const axes = new THREE.AxesHelper(1000);
    // scene.add(axes);

    // const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControl.update();

    $(window).resize(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function setRaycaster() {
    $(document)
      .mousedown(event => {
        pointer.visible = true;
        mouseDown = true;

        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;

        if (level.player.mixer) {
          level.player.setAnimation("run");
          level.player.model.rotation.y = 90;
        }

        if (Settings.activeAllies.length > 0) {
          Settings.activeAllies.forEach(ally => {
            ally.setAnimation("run");
          });
        }
      })
      .mouseup(event => {
        pointer.visible = false;
        mouseDown = false;
      })
      .mousemove(event => {
        // if (mouseDown) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        // }
      })
      .contextmenu(event => {
        event.preventDefault();
      });
  }

  let selectedAllyToHighlight;
  let ringAngle = 0;
  function castRaycaster() {
    raycaster.setFromCamera(mouseVector, camera);

    const intersects = raycaster.intersectObjects(level.floors);
    const allyIntersects = raycaster.intersectObjects(Settings.alliesMeshes);

    //FLOOR RAYCASTER
    if (intersects.length > 0 && mouseDown && allyIntersects.length == 0) {
      level.currentDestination = intersects[0].point;
    }
    placePointer(level.currentDestination);
    level.player.moveModel(level.currentDestination);

    //ALLY RAYCASTER
    if (allyIntersects.length > 0 && mouseDown) {
      let selectedAlly = allyIntersects[0].object.parent;
      if (!selectedAlly.active) {
        Settings.activeAllies.push(selectedAlly);
        selectedAlly.active = true;
      }
    }

    //

    if (allyIntersects.length > 0 && !mouseDown) {
      selectedAllyToHighlight = allyIntersects[0].object.parent;
      if (!selectedAllyToHighlight.active && !selectedAllyToHighlight.ring) {
        selectedAllyToHighlight.ring = new Ring();
        selectedAllyToHighlight.ring.rotateX(Math.PI / 2);
        selectedAllyToHighlight.add(selectedAllyToHighlight.ring);
      } else if (
        !selectedAllyToHighlight.active &&
        selectedAllyToHighlight.ring
      ) {
        //   ringAngle += 0.05;
        ringAngle = 1;
        selectedAllyToHighlight.ring.rotateZ(ringAngle * (Math.PI / 180));
      }
    } else {
      if (selectedAllyToHighlight && selectedAllyToHighlight.ring) {
        selectedAllyToHighlight.remove(selectedAllyToHighlight.ring);
        selectedAllyToHighlight.ring = null;
        ringAngle = 0;
      }
    }
    //

    if (Settings.activeAllies.length > 0) {
      for (let i = 0; i < Settings.activeAllies.length; i++) {
        if (i == 0)
          Settings.activeAllies[i].move(level.player.container.position);
        else
          Settings.activeAllies[i].move(Settings.activeAllies[i - 1].position);
      }
    }
  }

  function placePointer(point) {
    pointer.position.set(point.x, 0, point.z);
  }

  function setCameraToPlayer() {
    camera.position.set(
      level.player.container.position.x,
      level.player.container.position.y + 500,
      level.player.container.position.z + 250
    );

    camera.lookAt(level.player.container.position);
  }

  function countFps() {
    const now = performance.now();

    while (TIMES.length > 0 && TIMES[0] <= now - 1000) TIMES.shift();
    TIMES.push(now);
    fps = TIMES.length;

    $("#fpsCounter").text(`FPS: ${fps}`);
  }
});
