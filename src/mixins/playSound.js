export default {
  methods: {
    playSound(audioFile) {
      new Audio(audioFile).play();
    }
  }
};
