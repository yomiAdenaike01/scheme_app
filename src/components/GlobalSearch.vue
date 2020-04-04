<template>
  <el-dialog :visible.sync="view">
    <!-- Dropdown for filters goes here -->
    <div class="global_search_container">
      <el-input
        v-model="searchTerm"
        placeholder="Search what you want, we will take care of the rest..."
      ></el-input>

      <div class="content_container">
        <div v-if="searchTerm > 0" class="search_results_container">
          <p>{{ searchTerm }}</p>
        </div>
        <div class="predicitive_container">
          <InformationDisplay
            v-if="!hasEntries(cachedSearches)"
            :display-text="{
              heading: 'No previous searches',
              content: 'All previous searches will appear here'
            }"
          />
          <!-- cache searches and their results here -->
          <div></div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "GlobalSearch",

  components: {
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  props: {
    display: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchTerm: ""
    };
  },

  computed: {
    ...mapState(["clientInformation", "userInformation"]),
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("closeSearch");
      }
    },
    currentResults() {
      return "hello";
    },
    previousResults() {
      // Return the previous results for a search
      let cachedSearch = this.cachedSearches.find(search => {
        return search.toLowerCase().trim() == this.searchTerm;
      });

      return cachedSearch?.results ?? {};
    },
    cachedSearches() {
      let cachedSearches = localStorage.getItem("searches");
      return cachedSearches ?? [];
      /**
       * searches:[
       * {
       * term:yomi adenaikek:results:{
       * events:[],
       * chatMessages:[],
       * tasks:[],
       * notes:[],
       * view_profile:[],
       *
       * }}}
       */
    }
  },
  methods: {
    completeSearch() {
      // if there is no previous results then append to cache
    }
  }
};
</script>

<style lang="scss" scoped>
.global_search_container {
  .el-input {
    font-size: 1.3em;
  }
  &/deep/ .el-input__inner {
    border: none;
    font-size: 1.3em;
  }
}
.content_container {
  display: flex;
  flex: 1;
  border-top: 1px solid #efefef;
  background: rgb(250, 250, 250);
}
.predicitive_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
