<template>
  <div
    id="app"
    v-resize-text="defaultSize"
    :class="{ mobile: $mq != 'lg' }"
    v-loading="resolving"
  >
    <img :src="companyImage" />
    <!-- Error dialog -->
    <el-dialog center :visible.sync="error" width="700px">
      <div class="client_error_dialog">
        <Title
          title="Error when getting data."
          subtitle="Re-enter your company name to restart the process."
        />
        <el-input
          class="client_name"
          placeholder="Company Name"
          v-model="companyName"
        >
          <template slot="append">.schemeapp.cloud</template>
        </el-input>
        <div class="button_container m-4">
          <el-button
            round
            type="primary"
            :disabled="companyName.length <= 0"
            @click="getClient"
            >Retry</el-button
          >
          <el-button
            round
            plain
            @click="$router.push({ name: 'register' }), (error = false)"
            >Register with scheme cloud</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- Error dialog -->

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Title from "@/components/Title";
import refactorLocation from "@/mixins/refactorLocation";
import firebase, { storage } from "firebase";
export default {
  name: "app",
  data() {
    return {
      resolving: true,
      error: false,
      companyName: "",
      companyImage: ""
    };
  },
  created() {
    // If there is no client id
    this.getClient();
  },
  computed: {
    ...mapState(["notifications", "defaultSize"])
  },
  mixins: [refactorLocation],
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_CLIENT"]),

    getClient() {
      let currentHostname = window.location.hostname.split(".");
      if (this.companyName.length <= 0) {
        let client = window.location.hostname.toString().split(".");
        let subdomain = client[0];
        let domain = client[1];

        this.request({
          method: "GET",
          url: "clients/one",

          params: { client_name: subdomain }
        })
          .then(response => {
            this.resolving = false;
            let { company_image } = response;

            this.UPDATE_CLIENT(response);
            firebase
              .storage()
              .ref(company_image)
              .getDownloadURL()
              .then(url => {
                response.company_image = url;
                this.UPDATE_CLIENT(response);
              })
              .catch(error => {
                console.error(error);
              });
          })
          .catch(error => {
            this.resolving = false;
            this.error = true;
          });
      } else {
        this.refactorWindowLocation(this.companyName);
      }
    }
  },
  components: {
    Title
  },

  watch: {
    notifications(val) {
      this.$notify(val[0]);
    }
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow: hidden;
  /**
  _   _  _  ___ _  _    ___ 
  | \_/ |/ \| o ) || |  | __|
  | \_/ ( o ) o \ || |_ | _| 
  |_| |_|\_/|___/_||___||___|
                                                                                    
*/
  &.mobile {
    overflow: scroll;
    .el-drawer__body {
      overflow-y: scroll;
    }
  }
}
.trigger {
  cursor: pointer;
}
html,
body {
  height: 100%;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@import "./assets/spacing";
@import url("http://fast.fonts.net/t/1.css?apiType=css&projectid=ac1e1b2a-4472-4043-bb43-7925ca5b822d");
@font-face {
  font-family: "AvenirNextLTW01-Regular";
  src: url("./assets/Fonts/e9167238-3b3f-4813-a04a-a384394eed42.eot?#iefix");
  src: url("./assets/Fonts/e9167238-3b3f-4813-a04a-a384394eed42.eot?#iefix")
      format("eot"),
    url("./assets/Fonts/2cd55546-ec00-4af9-aeca-4a3cd186da53.woff2")
      format("woff2"),
    url("./assets/Fonts/1e9892c0-6927-4412-9874-1b82801ba47a.woff")
      format("woff"),
    url("./assets/Fonts/46cf1067-688d-4aab-b0f7-bd942af6efd8.ttf")
      format("truetype");
}

* {
  font-family: "AvenirNextLTW01-Regular";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

.light {
  font-weight: 300;
}
.bold {
  font-weight: bold;
}
.grey {
  color: #999;
}
.black {
  color: black;
}

a {
  text-decoration: none;
}
.member_name {
  text-transform: capitalize;
}
.client_error_dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .button_container {
    display: flex;
    justify-content: space-between;
  }
  .client_name {
    width: 80%;
  }
}
</style>
