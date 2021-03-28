<template>
  <div class="users">
    <img alt="Vue logo" src="../assets/mevn.jpg" width="350" />
    <UserTable @btnStart="startContainer" @btnStop="stopContainer" @btnDelete="deleteAccount" />
  </div>
</template>

<script>
// @ is an alias to /src
import UserTable from "@/components/UserTable.vue";

export default {
  name: "users",
  methods: {
    startContainer: function(username) {
      console.log("startContainer clicked from " + username);
    },
    stopContainer: function(username) {
      console.log("stopContainer clicked from " + username);
    },
    deleteAccount: function(username) {
      console.log("delete clicked from " + username);
    },
  },
  components: {
    UserTable,
  },
};
</script>
