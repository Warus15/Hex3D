let hexWallMaterials = new Array();
let hexFloorMaterials = new Array();
let treasureMaterials = new Array();
fillTextures();

const Settings = {
   hexRadius: 70,
   hexWallMaterial: hexWallMaterials,
   hexFloorMaterial: hexFloorMaterials,

   lightMaterial: new THREE.LineBasicMaterial({
      color: 0xffffff
   }),

   treasureMaterial: treasureMaterials,

   playerMaterial: new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("img/textures/player.png"),
      morphTargets: true
   }),

   allyMaterial: new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("img/textures/ally.png"),
      morphTargets: true
   }),

   allies: new Array(),
   alliesMeshes: new Array(),
   activeAllies: new Array(),

   ringMaterial: new THREE.MeshPhongMaterial({
      color: 0x00ff00ff,
      side: THREE.DoubleSide
   })
};

//
function fillTextures() {
   //Hex Walls
   for (let i = 0; i < 6; i++)
      hexWallMaterials.push(
         new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/textures/wall.jpg"),
            wireframe: false,
            opacity: 0.5
         })
      );

   //Hex Floor
   for (let i = 0; i < 6; i++)
      hexFloorMaterials.push(
         new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/textures/floor.png"),
            wireframe: false,
            opacity: 0.5
         })
      );

   //Treausres
   for (let i = 0; i < 6; i++)
      treasureMaterials.push(
         new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/textures/box.jpg"),
            wireframe: false,
            opacity: 0.5
         })
      );
}
