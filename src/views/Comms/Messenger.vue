<template>
  <el-row style="height:100%" type="flex" v-loading="loading">
    <el-col class="chatinfo_container">
      <el-dialog class="experimental_feature_dialog" title="Experimental Feature" :visible.sync="experimentalFeatureDialogDisplay">
        <div class="experimental_feature_dialog_title" slot="title">
          <h2><i style="color:#E6A23C"  class="el-icon-warning"/> Experimental Feature Warning  </h2>
          </div>
        <p>
          This is still an experimental feature and therefore, if you experience any bugs with this please take note of them and publish a bug report here.
        </p>
        <div class="button_center">
        <el-button type="warning">Submit Bug Report</el-button>
        </div>
      </el-dialog>
      <StartNewChat />
      <PreviousChat />
    </el-col>
    <MessengerBody />
  </el-row>
</template>

<script>
import StartNewChat from './components/StartNewChat'
import MessengerBody from './components/MessengerBody'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'Messenger',
  data(){
    return{
      experimentalFeatureDialogDisplay:true
    }
  },
  
  computed: {
    ...mapState('Admin', ['team']),
    ...mapState('Comms', ['transcripts']),
    loading() {
      let team = this.team.length <= 0
      let transcripts = this.transcripts <= 0
      return team && transcripts
    }
  },
  components: {
    PreviousChat: () => import('./components/PreviousChat'),
    StartNewChat,
    MessengerBody
  }
}
</script>

<style lang="scss" scoped>
.chatinfo_container {
  height: 100%;
  background: #fdfdfd;
  border-right: 1px solid #e6e6e6;
  flex: 0.5;
}

.chat_sender_container {
  display: flex;
  padding: 1.5em;
}
.button_center{
  display:flex;
  justify-content: center;
  align-items: center;
  margin:2em;
}
.experimental_feature_dialog{
  p{
    text-align: center;
    padding:20px;
    font-size: 1.1em;
  }
}
</style>
