class Hex {
   constructor(ID, posX, posZ, x, z, currentType) {
      this.hex = null;
      this.posX = posX;
      this.posZ = posZ;

      this.desc;

      this.init(ID, x, z, currentType);
   }

   init(ID, x, z, currentType) {
      this.hex = $("<div>");
      this.hex.addClass("hex");
      this.hex.css("left", this.posX);
      this.hex.css("top", this.posZ);

      this.generateHexDesc(ID, x, z, currentType);

      $("#editor").append(this.hex);
   }

   generateHexDesc(ID, x, z, currentType) {
      this.desc = new HexDesc(ID, x, z, currentType);
      $(this.hex).append(this.desc.container);
   }
}
