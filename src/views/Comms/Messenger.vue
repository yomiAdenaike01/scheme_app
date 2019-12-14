<template>
  <el-container>
    <el-aside>
      <h1>Chat List</h1>
    </el-aside>
    <el-main style="background:rgb(252,252,252)">
      <el-aside>
        <h1>Chat Body</h1>
      </el-aside>
      <el-row type="flex" justify="center" align="center">
        <el-col :span="20">
          <el-input placeholder="Message Content" v-model="messageContent" />
        </el-col>
        <el-button
          v-loading="loading"
          icon="el-icon-s-promotion"
          @click="sendMessage"
          class="ml-3"
        />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Messenger",
  data() {
    return {
      messageContent: "",
      loading: false
    };
  },
  methods: {
    sendMessage() {}
  }
};
</script>

<style>
</style>