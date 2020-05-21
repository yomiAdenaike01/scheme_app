<template>
  <Overlay :display="displayOverlay" @close="closeOverlay">
    <div class="team_overlay">
      <div class="navigation_container">
        <strong class="capitalize"> {{ makePretty(langXref[view]) }}</strong>
        <i
          :class="
            `bx bx-${
              view == 'create_group' ? 'left' : 'right'
            }-arrow-alt trigger`
          "
          @click="updateView"
        ></i>
      </div>

      <Form
        v-if="view == 'create_user'"
        :headings="headings"
        all-optional
        :config="teamMemberFormConfig"
        emit-on-change
        :submit-button="{
          text: mode == 'update' ? 'Update team member' : 'Create team member'
        }"
        @val="$emit('handleTeamMember', inputtedTeamMemberData)"
        @change="updateTeamMemberObject"
      >
        <div slot="header" class="text_container team_overlay_body">
          <div class="text_display_header">
            <SlideYUpTransition>
              <div v-if="mode == 'update'">
                <Avatar
                  :size="100"
                  :name="
                    inputtedTeamMemberData.name
                      ? inputtedTeamMemberData.name
                      : selectedTeamMember.name
                  "
                />
                <div v-if="Object.values(selectedTeamMember).length > 0">
                  <p
                    v-for="(item, index) in teamMemberFormConfig"
                    :key="`${item.model}${index}`"
                    :class="[
                      `${item.model}_item`,
                      {
                        grey: item.model != 'name',
                        'bold capitalize': item.model == 'name'
                      }
                    ]"
                  >
                    {{
                      item.model == "user_group"
                        ? userGroupXref
                        : !inputtedTeamMemberData[item.model]
                        ? selectedTeamMember[item.model]
                        : inputtedTeamMemberData[item.model]
                    }}
                  </p>
                </div>
              </div>
              <div v-else>
                <SlideYUpTransition>
                  <Avatar
                    v-if="inputtedTeamMemberData.name"
                    :size="100"
                    :name="inputtedTeamMemberData.name"
                  />
                </SlideYUpTransition>
                <div v-if="Object.values(inputtedTeamMemberData).length > 0">
                  <p
                    v-for="(item, index) in teamMemberFormConfig"
                    :key="`${item.model}${index}`"
                    :class="[
                      `${item.model}_item`,
                      {
                        grey: item.model != 'name',
                        'bold capitalize': item.model == 'name'
                      }
                    ]"
                  >
                    {{
                      item.model == "user_group"
                        ? userGroupXref
                        : inputtedTeamMemberData[item.model]
                    }}
                  </p>
                </div>
              </div>
            </SlideYUpTransition>
          </div>
        </div>
      </Form>

      <UpdateGroups v-else group-type="user_groups" />
    </div>
  </Overlay>
</template>

<script>
import { mapGetters } from "vuex";
import Avatar from "@/components/Avatar";
import Overlay from "@/components/Overlay";
import Form from "@/components/Form";
import UpdateGroups from "@/components/UpdateGroups";

import { SlideYUpTransition } from "vue2-transitions";

export default {
  components: {
    Overlay,
    Form,
    SlideYUpTransition,
    Avatar,
    UpdateGroups
  },
  props: {
    mode: {
      type: String,
      default: "create"
    },

    selectedTeamMember: {
      type: Object,
      default: () => {
        return {};
      }
    },
    displayOverlay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputtedTeamMemberData: {},
      view: "create_user"
    };
  },
  computed: {
    ...mapGetters(["getUserGroups"]),

    langXref() {
      return {
        create_group: "manage groups",
        create_user: "create new user"
      };
    },

    userGroupXref() {
      let group = this.getUserGroups.find(group => {
        return group.value == this.inputtedTeamMemberData.user_group;
      })?.label;
      if (this.mode == "create") {
        return group;
      } else {
        return this.selectedTeamMember.user_group.label;
      }
    },
    headings() {
      return {
        name: `
        <h3>Personal information</h3>
        `,
        phoneNumber: `
        <h3>Contact information</h3>
        `,

        user_group: `<h3>Misc information</h3/>`
      };
    },
    teamMemberFormConfig() {
      return [
        {
          "component-type": "text",
          model: "name",
          placeholder: "First and lastname",
          noLabel: true
        },

        {
          "component-type": "text",
          model: "phoneNumber",
          placeholder: "Phone number",
          noLabel: true
        },
        {
          "component-type": "text",
          model: "email",
          placeholder: "Email address",
          noLabel: true
        },
        {
          model: "user_group",
          "component-type": "select",
          options: this.getUserGroups,
          noLabel: true,
          placeholder: "Assign to user group"
        },
        {
          "component-type": "text",
          "input-type": "textarea",
          model: "notes",
          placeholder: "Notes",
          noLabel: true
        }
      ];
    }
  },
  methods: {
    updateTeamMemberObject(e) {
      this.inputtedTeamMemberData = e;
    },

    updateView() {
      if (this.view == "create_user") {
        this.view = "create_group";
      } else {
        this.view = "create_user";
      }
    },

    closeOverlay(clearSearch) {
      this.$emit("close");
      this.inputtedTeamMemberData = {};
      if (clearSearch) {
        this.$emit("clearSearch");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.navigation_container {
  background: rgb(250, 250, 250);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
}
.team_overlay {
  display: flex;
  flex-direction: column;
  &/deep/ .text_display_container .headings_wrapper {
    padding-bottom: 0;
  }
}
p {
  margin: 0;
}

.text_display_header {
  margin-top: 30px;
}
.user_info_item {
  margin: 0;
  &:first-of-type {
    margin-top: 10px;
  }
}
.user_info_item.firstname {
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 5px;
}
.selected_user_avatar {
  margin: 0 40px;
}
.edit_user_wrapper {
  display: flex;
  padding: 10px;
  > * {
    flex: 1;
  }
}
.name_item,
.notes_item {
  margin-top: 10px;
}
.name_item {
  font-size: 1.3em;
  margin-bottom: 5px;
}
.text_container {
  padding: 20px;
}
</style>
