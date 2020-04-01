<template>
  <div class="event_group_management_container">
    <div class="buttons_container">
      <el-button
        v-for="(button, index) in config"
        :key="index"
        :type="selectedConfig == button ? 'primary' : 'plain'"
        @click="changeContent(button)"
      >
        {{ `${button} group` }}
      </el-button>
    </div>
    <el-collapse-transition>
      <div v-if="displayContent" class="group_management_container">
        <Form
          :config="form"
          all-optional
          emit-on-change
          :submit-text="`${selectedConfig} group`"
          @change="eventsGroupInformation = $event"
          @val="runRequest"
        />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Form from "@/components/Form";
export default {
  name: "EventGroupManagement",
  components: {
    Form
  },
  data() {
    return {
      selectedConfig: "",
      eventsGroupInformation: {},
      displayContent: false
    };
  },

  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    modUserGroups() {
      let modUserGroups = [...this.clientInformation.userGroups];
      let allUsersIndex = modUserGroups.findIndex(group => {
        return group.value == 0;
      });
      modUserGroups.splice(allUsersIndex, 1, {
        label: "All team members",
        value: 0
      });

      return modUserGroups;
    },
    enabledFor() {
      return this.clientInformation.eventGroups.find(group => {
        return this.eventsGroupInformation.groupID == group.value;
      })?.enabledFor;
    },
    usersInEventGroup() {
      let users = [];
      if (this.enabledFor) {
        users = this.teamInformation.map(({ name, _id }) => {
          return { name, _id };
        });
      } else {
        users = this.teamInformation.filter(teamMember => {
          return this.enabledFor?.indexOf(teamMember.groupID) > -1;
        });
      }
      return users;
    },
    usersText() {
      let textContent = "";

      if (this.eventsGroupInformation?.groupID == 0) {
        textContent = "All users";
      } else {
        textContent = this.usersInEventGroup.map(user => user.name).join(",");
      }
      return textContent;
    },
    configPayloadXref() {
      let url = "clients/group",
        data = this.eventsGroupInformation;
      let payloadXref = {
        Create: {
          request: {
            method: "POST"
          },
          form: [
            {
              "component-type": "text",
              placeholder: "Event group name",
              required: true,
              model: "name"
            }
          ]
        },
        Edit: {
          request: {
            method: "PUT"
          },

          form: [
            {
              "component-type": "select",
              placeholder: "Select event group",
              required: true,
              options: this.clientInformation.eventGroups,
              model: "groupID"
            }
          ]
        },
        Delete: {
          request: {
            method: "DELETE"
          },

          form: [
            {
              "component-type": "select",
              placeholder: "Select event group",
              required: true,
              options: this.clientInformation.eventGroups,
              model: "groupID"
            }
          ]
        }
      };
      if (this.selectedConfig == "Edit") {
        payloadXref[this.selectedConfig].form.push(
          {
            "component-type": "text",
            placeholder: "Name",
            model: "name"
          },
          {
            "component-type": "select",
            placeholder: "Enable group for",
            options: this.modUserGroups,
            multiple: true,
            model: "enabledFor",
            hint: `Already enabled for the following users <strong>${this.usersText}</strong>`
          }
        );
      }
      payloadXref[this.selectedConfig].request = {
        ...payloadXref[this.selectedConfig].request,
        data,
        url
      };
      return payloadXref[this.selectedConfig];
    },
    payload() {
      return this.configPayloadXref.request;
    },
    form() {
      return this.configPayloadXref.form;
    },
    config() {
      let arr = ["Create"];
      if (this.clientInformation.eventGroups.length > 0) {
        arr.push("Delete", "Edit");
      }
      return arr;
    }
  },
  methods: {
    ...mapActions(["request"]),
    changeContent(button) {
      this.selectedConfig = button;
      this.displayContent = true;
      this.eventsGroupInformation = {};
    },
    runRequest() {
      let payload = { ...this.payload };
      payload.data.value = this.loading = true;

      this.request(this.payload)
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    liveChange(e) {
      this.$set(this, "eventsGroupInformation", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.buttons_container {
  display: flex;
  justify-content: center;
  align-items: center;
  &/deep/ .el-button {
    font-size: 1.5em;
  }
}
.group_management_container {
  padding: 20px;
}
</style>
