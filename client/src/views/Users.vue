<template>
  <div class="users">
    <img alt="Slogan in ASCII" src="../assets/banner.jpg" width="950" />
    <UserTable
      :filter="filter"
      @btnStart="startContainer"
      @btnStop="stopContainer"
      @btnDelete="deleteAccount"
    />    
  </div>
</template>

<script>
// @ is an alias to /src
import UserTable from "@/components/UserTable.vue";
export default {
  name: "users",
  data() {
    return {
      filter: "",
    };
  },
  methods: {
    startContainer: function (username) {
      //console.log("startContainer clicked from " + username);
      let post = {
        username: username,
      };
      this.axios.post("/container/start", post).then((/* response */) => {
        //console.log(response.data)
      });
    },
    stopContainer: function (username) {
      //console.log("stopContainer clicked from " + username);
      let post = {
        username: username,
      };
      this.axios.post("/container/stop", post).then((/* response */) => {
        //console.log(response.data)
      });
    },
    deleteAccount: function (username) {
      //console.log("delete clicked from " + username);
      let post = {
        data: {
          username: username,
        },
      };
      this.axios.delete("/user/users", post).then((/* response */) => {
        //console.log(response.data)
      });
    },
  },
  mounted() {
    if (this.$route.params.filter !== undefined) {
      //let userFilter = this.$route.params.filter;
      //alert(this.$route.params.filter + "1");
      this.filter = this.$route.params.filter;
    } else {
      //alert("kein filter");
      this.filter = "";
    }
  },
  components: {
    UserTable,
  },
};
</script>
