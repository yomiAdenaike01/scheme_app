import notificationSuccessSound from "@/assets/Sounds/successSound.mp3";
import notificationErrorSound from "@/assets/Sounds/errorSound.mp3";
export default {
  methods: {
    playSuccessSound() {
      let audio = new Audio(notificationSuccessSound);
      audio.play();
    },
    playErrorSound() {
      let audio = new Audio(notificationErrorSound);

      audio.play();
    }
  }
};
