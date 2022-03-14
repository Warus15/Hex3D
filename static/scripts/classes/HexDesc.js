class HexDesc {
   constructor(ID, x, z, currentType) {
      this.container = null;

      this.hexID = ID;
      this.dirP = null;
      this.currentDirection = 0;
      this.currentRotation = 0;
      this.hidden = true;

      this.x = x;
      this.z = z;

      this.type = currentType;
      this.dirsIn = null;

      this.info = null;

      this.init();
   }

   init() {
      this.container = $("<div>");
      this.container.addClass("hexDesc");

      this.dirP = $("<p>");
      this.dirP.html(this.currentDirection);
      this.dirP.addClass("directionP");

      $(this.container).append(this.dirP);

      this.container.css("opacity", "0");
   }

   changeDesc() {
      if (this.hidden) {
         this.hidden = false;
         this.updateDesc();
         return;
      } else {
         this.currentRotation += 60;
         this.currentDirection++;

         if (this.currentRotation < 360) this.updateDesc();
         else {
            this.hidden = true;
            this.currentDirection = 0;
            this.currentRotation = 0;
            this.updateDesc();
         }
      }
   }

   updateDesc() {
      this.dirP.html(this.currentDirection);
      this.container.css("transform", `rotatez(${this.currentRotation}deg)`);

      if (!this.hidden) {
         this.container.css("opacity", "1");

         this.info = {
            id: this.hexID,
            x: this.x,
            z: this.z,
            dirIn: this.dirsIn,
            dirOut: this.currentDirection,
            type: this.type
         };
      } else {
         this.container.css("opacity", "0");
         this.info = null;
      }
   }
}
