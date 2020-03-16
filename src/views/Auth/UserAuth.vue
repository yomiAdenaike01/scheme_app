<template>
  <div class="login_container">
    <div class="flex_container">
      <el-card class="form_container">
        <el-container class="h-100">
          <el-main class="login_wrapper">
            <!-- Display the clients image -->
            <ClientImage :center="true" class="mb-4" />
            <!-- Auth Register &  Login -->
            <Form :config="formConfig" submitText="Login" @val="login" />
            <!-- New client registration -->
            <div
              class="new_client_button_container mb-4 mt-4"
              slot="header_content"
            >
              <!-- New client registration -->
              <el-button
                v-if="!isValidClient"
                @click="$router.push({ name: 'register' })"
                round
                size="small"
                type="primary"
                >Registering a new company ? Click here to register.</el-button
              >
            </div>
          </el-main>
        </el-container>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import Form from "@/components/Form";
import ClientImage from "@/components/ClientImage";
export default {
  name: "UserAuth",
  data() {
    return {
      newUser: false,
      loading: false
    };
  },
  activated() {
    if (this.hasEntries(this.$route.params)) {
      this.login(this.$route.params);
    }
    if (!this.hasEntries(this.clientInformation)) {
      this.getClient()
        .then(response => {
          this.UPDATE_CLIENT(response);
        })
        .catch(() => {
          return;
        });
    }
  },
  computed: {
    isValidClient() {
      return this.hasEntries(this.clientInformation);
    },
    ...mapState(["clientInformation"]),

    returnPayload() {
      return {};
    },

    returnForm() {
      return this.formConfig[this.selectedForm];
    },
    formConfig() {
      return [
        {
          name: "email",
          "component-type": "text",
          placeholder: "Email",
          model: "email"
        },
        {
          name: "password",
          "component-type": "password",
          placeholder: "Password",
          model: "password"
        }
      ];
    }
  },
  methods: {
    ...mapActions(["request", "getClient"]),
    ...mapMutations(["UPDATE_USER", "UPDATE_NOTIFICATIONS"]),

    setFormAndProcessUser(e) {
      try {
        this.$set(this.formModel, this.selectedForm, e);
        this.processUser();
      } catch (error) {
        console.log(error);
      }
    },
    login(credentials) {
      this.loading = true;
      this.request({
        method: "POST",
        data: {
          clientID: this.clientInformation._id,
          ...credentials
        },
        url: "/users/login"
      })
        .then(response => {
          this.UPDATE_USER(response);

          if (response.user.admin_gen == true) {
            this.UPDATE_NOTIFICATIONS({
              type: "warning",
              title: "Insecure Password Detected",
              message:
                "Your password is insecure, please consider changing it in the user settings."
            });

            this.$router.push({ name: "events" });
          }

          this.$router.push({ name: "events" });

          this.loading = false;
          // this.changeTab("login");
        })
        .catch(error => {
          this.loading = false;
        });
    }
  },
  components: {
    Form,
    ClientImage
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  height: 100%;
}
.register_as_new_client_wrapper {
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 1em 0;
  cursor: pointer;
}
.flex_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  margin: 0;
}
.form_container {
  min-width: 25%;
}
.switch_button {
  border: 1px solid $element_colour;
}
.new_client_button_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
