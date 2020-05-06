<template>
  <Overlay :display="displayOverlay" @close="closeOverlay">
    <div class="team_overlay">
      <Form
        :headings="headings"
        all-optional
        :config="teamMemberFormConfig"
        emit-on-change
        :submit-button="{
          text: mode == 'update' ? 'Update team member' : 'Create team member'
        }"
        @val="handleTeamMember"
        @change="updateTeamMemberObject"
      >
        <TextDisplay
          slot="header"
          :display-text="{
            heading:
              mode == 'update' ? 'Edit team member' : 'Create team member',
            headingAlign: false,
            textAlign: false,
            contentClass: 'grey',
            content:
              'The changes that are made in this form will be reflected in the instance below. Once submitted these changes will be made live.'
          }"
        >
          <div slot="body" class="text_display_header">
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
        </TextDisplay>
      </Form>
    </div>
  </Overlay>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import Overlay from "@/components/Overlay";
import Form from "@/components/Form";
import TextDisplay from "@/components/TextDisplay";

import { SlideYUpTransition } from "vue2-transitions";

export default {
  components: {
    Overlay,
    Form,
    TextDisplay,
    SlideYUpTransition
  },
  props: {
    mode: {
      type: String,
      default: "create"
    },
    selectedTeamMemberIndex: {
      type: Number,
      default: 0
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
      inputtedTeamMemberData: {}
    };
  },
  computed: {
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
    },
    handleTeamMemberXref() {
      return {
        requestPayloads: {
          create: {
            method: "POST",
            url: "users/register",
            data: {
              client_id: this.clientInformation._id,
              admin_gen: true,
              ...this.inputtedTeamMemberData
            }
          },
          update: {
            method: "PUT",
            url: "users/update",
            data: {
              _id: this.selectedTeamMember._id,
              update: this.inputtedTeamMemberData
            }
          },
          delete: {
            method: "DELETE",
            url: "users/delete",
            data: { _id: this.selectedTeamMember._id }
          }
        },
        methods: {
          create: {
            mutation: "CREATE_TEAM_MEMBER",
            data: {
              _id: Math.random()
                .toString(16)
                .slice(2),
              ...this.inputtedTeamMemberData
            }
          },
          update: {
            mutation: "UPDATE_ONE_TEAM_MEMBER",
            data: {
              index: this.selectedTeamMemberIndex,
              payload: this.inputtedTeamMemberData
            }
          },
          delete: {
            mutation: "DELETE_TEAM_MEMBER",
            data: { index: this.selectedTeamMemberIndex }
          }
        }
      };
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Team", [
      "UPDATE_ONE_TEAM_MEMBER",
      "DELETE_TEAM_MEMBER",
      "CREATE_TEAM_MEMBER"
    ]),
    updateTeamMemberObject(e) {
      this.inputtedTeamMemberData = e;
    },
    handleTeamMember() {
      // Update team member from form
      let methodXref = this.handleTeamMemberXref.methods[this.mode];
      let requestXref = this.handleTeamMemberXref.requestPayloads[this.mode];
      this[methodXref.mutation](methodXref.data);
      this.request(requestXref).catch(() => {
        this.displayOverlay = true;
      });
      this.closeOverlay();
    },
    closeOverlay(clearSearch) {
      this.displayOverlay = false;
      this.inputtedTeamMemberData = {};
      if (clearSearch) {
        this.$emit("clearSearch");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.team_overlay {
  display: flex;
  flex-direction: column;
  &/deep/ .text_display_container .headings_wrapper {
    padding-bottom: 0;
  }
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
</style>
