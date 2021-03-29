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
      let post =  {
        username: username
        };
      this.axios.post('http://localhost:9000/container/start', post).then((response) => {
      console.log(response.data)
      })
    },
    stopContainer: function(username) {
      console.log("stopContainer clicked from " + username);
      let post =  {
        username: username
        };
      this.axios.post('http://localhost:9000/container/stop', post).then((response) => {
      console.log(response.data)
      })
    },
    deleteAccount: function(username) {
      console.log("delete clicked from " + username);
      let post = {data: {
        username: username}
        };
      this.axios.delete('http://localhost:9000/user/users', post).then((response) => {
      console.log(response.data)
      })
    },
  },
  components: {
    UserTable,
  },
};
</script>
