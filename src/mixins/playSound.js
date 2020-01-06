import notificationSuccessSound from "@/assets/Sounds/successSound.mp3";
import notificationErrorSound from "@/assets/Sounds/errorSound.mp3";
export default {
  methods: {
    playSuccessSound() {
      new Audio(notificationSuccessSound).play();
    },
    playErrorSound() {
      new Audio(notificationErrorSound).play();
    }
  }
};
