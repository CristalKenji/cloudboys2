<template>
  <div class="container">
    <h3 class="p-3 text-center">Vue.js - Display a list of items with v-for</h3>
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>State</th>
          <th>IP</th>
          <th>DNS</th>
          <th colSpan="2">Container Functions</th>
          <th>Account</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.state }}</td>
          <td>{{ user.ip }}</td>
          <td>{{ user.dns }}</td>
          <td>
            <b-button :disabled='user.state !== "Stopped"' @click="$emit('btnStart', user.name, $event)" variant="outline-primary"
            :title="user.state === 'Stopped'? 'Starts the container' : 'Container must be stopped for execution'">
              Start
            </b-button>
          </td>
          <td>
            <b-button :disabled='user.state !== "Running"' @click="$emit('btnStop', user.name, $event)" variant="outline-primary"
            :title="user.state === 'Running'? 'Stops the container' : 'Container must be running for execution'">
              Stop
            </b-button>
          </td>
          <td>
            <b-button :disabled='user.state !== "Stopped"' @click="$emit('btnDelete', user.name, $event)" variant="outline-danger" 
            v-b-tooltip.hover :title="user.state === 'Stopped'? 'Deletes entire account' : 'Container must be stopped for execution'">
              Delete
            </b-button>           
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: "",
      users: [
        { name: "Frank", state: "Pending", ip: "192:168:45:12", dns: "accessible-giant-panda.germanywestcentral.azurecontainer.io" },
        { name: "Vic", state: "Pending", ip: "...", dns: "vic.reynolds@test.com" },
        { name: "Gina", state: "Pending", ip: "...", dns: "gina.jabowski@test.com" },
        { name: "Jessi", state: "Pending", ip: "...", dns: "jessi.glaser@test.com" },
        { name: "Jay", state: "Pending", ip: "...", dns: "Usjay.bilzerian@test.comer" },
        { name: "Franky", state: "Pending", ip: "...", dns: "frank.murphy@test.com" },
        { name: "Vicy", state: "Pending", ip: "...", dns: "vic.reynolds@test.com" },
        { name: "Gina2", state: "Pending", ip: "...", dns: "gina.jabowski@test.com" },
        { name: "Jessica", state: "Pending", ip: "...", dns: "jessi.glaser@test.com" },
        { name: "Jay-Jay", state: "Pending", ip: "...", dns: "Usjay.bilzerian@test.comer" },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const searchTerm = this.filter;
        console.log(searchTerm);
        if (searchTerm === "") {
          return this.users;
        } else {
          return user.name === searchTerm;
        }
      });
    },
  },
};
</script>
