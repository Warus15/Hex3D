class Ui {
   constructor(level) {
      this.level = level;

      this.addListeners();
   }

   addListeners() {
      $("#intensity").on("input", () => {
         let intensity = $("#intensity").val() / 100;
         this.changeLightsIntensity(intensity);
      });

      $("#yPosition").on("input", () => {
         let yPosition = parseInt($("#yPosition").val());
         this.changeLightsPosition(yPosition);
      });
   }

   changeLightsIntensity(intensity) {
      this.level.lightRooms.forEach(element => {
         element.light.changeIntensity(intensity);
      });
   }

   changeLightsPosition(position) {
      this.level.lightRooms.forEach(element => {
         element.bulb.position.set(0, position, 0);
      });
   }
}
