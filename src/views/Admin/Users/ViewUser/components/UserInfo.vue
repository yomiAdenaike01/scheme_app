<template>
  <div class="user_info_container" v-loading="loading">
    <div class="quick_actions_container flex flex--end align-center">
      <el-button round size='mini'  @click="requestgenEmail">Contact</el-button>
      <Popover trigger="click">
        <el-button slot="trigger" round size='mini' v-if="getIsAdmin" >{{
          data.groupID == 0 ? "Assign to group" : "Reassign to group"
        }}</el-button>
        <el-select
          slot="content"
          @change="assignUserToGroup"
          v-model="selectedGroup"
        >
          <el-option
            v-for="group in getUserGroups"
            :label="group.label"
            :value="group.value"
            :key="group.value"
          >
          </el-option>
        </el-select>
      </Popover>
      <el-button round size='mini' v-if="getIsAdmin"  @click="removeUser"
        >Delete Account</el-button
      >
      <Popover trigger='click'>
      <el-button round size='mini' slot='trigger'>Make Changes</el-button>
      <Form submitText='Update user' slot='content' :config='updateUserForm' @val='updateUser'/>
      </Popover>
    </div>
    <h1>User Info</h1>
    <div class="info_container">

    <p>{{ date }}</p>
    <p>{{ data.name }}</p>
    <p>{{ data.email }}</p>
    <p class="member_name">{{ group }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Popover from "@/components/Popover";
import Form from '@/components/Form';
export default {
  name: "UserInfo",
  data() {
    return {
      selectedGroup: "",
      loading: false
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("Admin", ["getGroupName", "getUserGroups"]),
    ...mapGetters(["getIsAdmin", "getUserDevices"]),
    updateUserForm(){
      return [
        {
          'component-type':'text',
          model:'name',
          placeholder:'Team member name',
          optional:true
        },
        {
          'component-type':'select',
          placeholder:'User groups',
          options:this.getUserGroups,
          "validType":'number',
          model:'userGroup',
          optional:true
        },
        {
          'component-type':'date-picker',
          placeholder:'Date Of Birth',
          'input-type':'date',
          model:'dateOfBirth',
          optional:true
        }
      ]
    },
    date() {
      return this.formatDate(this.data.dateCreated);
    },
    group() {
      return this.getGroupName("event", this.data.groupID)?.name;
    },
    removeUnwantedProperties() {
      let cleanedProperties = {};
      for (let property in this.data) {
        cleanedProperties[property] = this.data[property];
      }
      return cleanedProperties;
    }
  },
  methods: {
    ...mapActions(["genEmail", "request", "closeDialog"]),
    ...mapActions('Admin',['getTeam']),
    ...mapMutations(['UPDATE_NOTIFICATIONS']),
    updateUser(e){
      if(!this.hasEntries(e)){
        this.UPDATE_NOTIFICATIONS({
          type:'error',
          message:'Error updating user, params are missing'
        })
      }else{
    e.dateOfBirth = this.initMoment(e?.dateOfBirth).toISOString()
      this.request({
        method:'PUT',
        url:'users/update',
        data:{update:{...e},_id:this.data._id}
      }).then(response=>{
        this.getTeam();
        this.closeDialog();
      }).catch(err=>{
        console.log(err);
      })
      }

    }, 
    assignUserToGroup() {
      this.loading = true;
      this.request({
        method: "PUT",
        url: "users/update",
        data: { update: { _id: this.data._id, groupID: this.selectedGroup } }
      })
        .then(() => {
          this.loading = false;
          this.closeDialog();
        })
        .catch(() => {
          this.loading = false;
          this.closeDialog();
        });
    },
    removeUser() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "users/remove",
        data: { _id: this.data._id }
      })
        .then(() => {
          this.loading = false;
          this.closeDialog();
        })
        .catch(() => {
          this.loading = false;
          this.closeDialog();
        });
    },
    requestgenEmail() {
      let emailContent = {
        to: "adenaikeyomi@gmail.com",
        subject: "even diff Contact",
        context: {
          test: "Hello from the render"
        }
      };
      this.genEmail(emailContent)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.warn(err);
        });
    }
  },
  components: {
    Popover,
    Form
  }
};
</script>

<style lang="scss" scoped>
.user_info_container {
  line-height: 2em;
}
.info_container{
  margin-top: 20px;
  padding:20px;
  border-radius: 5px;
  border: 2px solid whitesmoke;
  font-size: 1.2em;
  line-height: 2.2em;

}
.quick_actions_container{
  & /deep/ > *{
    margin-right:10px
  }
}
</style>
