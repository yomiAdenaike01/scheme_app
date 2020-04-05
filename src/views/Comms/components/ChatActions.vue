<template>
  <div class="actions">
    <Popover trigger="click">
      <div slot="trigger" class="interaction_container emoji_container">
        <i class="bx bx-wink-smile bx-tada"></i>
      </div>
      <div slot="content" class="emoji_content">
        <p>emoji content</p>
      </div>
    </Popover>
    <Popover trigger="click">
      <div slot="trigger" class="interaction_container emoji_container">
        <i class="bx bx-paperclip"></i>
      </div>
      <div slot="content" class="emoji_content">
        <p>attachments</p>
      </div>
    </Popover>
  </div>
</template>

<script>
export default {
  name: "ChatActions",
  components: {
    Popover: () => import("@/components/Popover")
  }
};
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  flex: 1;
  justify-content: space-between;
  max-width: 100px;
}
.interaction_container {
  cursor: pointer;
  background: whitesmoke;
  padding: 10px;
  border-radius: 50%;
  color: #555;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
