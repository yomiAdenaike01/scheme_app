<template>
  <div class="global_search_container">
    <!-- Dropdown for filters goes here -->
    <div
      v-click-outside="$emit('closeSearch')"
      class="global_search_inner_container"
    >
      <el-input
        v-model="searchTerm"
        placeholder="Search what you want, we will take care of the rest..."
      ></el-input>
      <div v-if="searchTerm > 0" class="search_results_container"></div>
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
</template>

<script>
import { mapState } from "vuex";
import ClickOutside from "vue-click-outside";

export default {
  name: "GlobalSearch",
  directives: {
    ClickOutside
  },
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay")
  },

  data() {
    return {
      searchTerm: ""
    };
  },

  computed: {
    ...mapState(["clientInformation", "userInformation"]),
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
       * messages:[],
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
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.6);
  display: flex;
  z-index: 99999;
  padding: 40px;
}
.global_search_inner_container {
  display: flex;
  border-radius: 20px;
  background: white;
  max-height: 500px;
  flex-direction: column;
  flex: 1;
  .el-input {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: initial;
  }
  &/deep/ .el-input__inner {
    padding: 40px;
    font-size: 1.2em !important;
  }
}
.predicitive_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
