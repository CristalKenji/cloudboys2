<template>
  <div class="container">
    <h3 class="p-3 text-center">
      Vue.js - Display a list of items with v-for {{ filter }}
    </h3>
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>State</th>
          <th>DNS</th>
          <th>Details</th>
          <th colSpan="2">Container Functions</th>
          <th>Account</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.state }}</td>
          <td>{{ user.dns }}</td>
          <td>
            <b-button
              :disabled="user.state !== 'Running'"
              @click="$emit('btnDetails', user.name, $event)"
              variant="outline-success"
              :title="
                user.state === 'Stopped'
                  ? 'Show container details'
                  : 'Container must be running'
              "
            >
              Details
            </b-button>
          </td>
          <td>
            <b-button
              :disabled="user.state !== 'Stopped'"
              @click="$emit('btnStart', user.name, $event)"
              variant="outline-primary"
              :title="
                user.state === 'Stopped'
                  ? 'Starts the container'
                  : 'Container must be stopped for execution'
              "
            >
              Start
            </b-button>
          </td>
          <td>
            <b-button
              :disabled="user.state !== 'Running'"
              @click="$emit('btnStop', user.name, $event)"
              variant="outline-primary"
              :title="
                user.state === 'Running'
                  ? 'Stops the container'
                  : 'Container must be running for execution'
              "
            >
              Stop
            </b-button>
          </td>
          <td>
            <b-button
              :disabled="
                user.state !== 'ResourceNotFound' && user.state !== 'Stopped'
              "
              @click="$emit('btnDelete', user.name, $event)"
              variant="outline-danger"
              v-b-tooltip.hover
              :title="
                user.state === 'Stopped' || user.state === 'ResourceNotFound'
                  ? 'Deletes entire account'
                  : 'Container must be stopped for execution'
              "
            >
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
  props: {
    filter: String,
  },
  data() {
    return {
      users: [
        {
          name: "Frank",
          state: "Pending",
          dns: "accessible-giant-panda.germanywestcentral.azurecontainer.io",
        },
        { name: "Vic", state: "Pending", dns: "vic.reynolds@test.com" },
        { name: "Gina", state: "Pending", dns: "gina.jabowski@test.com" },
        { name: "Jessi", state: "Pending", dns: "jessi.glaser@test.com" },
        { name: "Jay", state: "Pending", dns: "Usjay.bilzerian@test.comer" },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const searchTerm = this.filter;
        //console.log(searchTerm);
        if (searchTerm === "") {
          return this.users;
        } else {
          return user.name === searchTerm;
        }
      });
    },
  },
  methods: {
    getTableData: function () {
      // axios stuff
      //console.log("fetching data");
      this.axios.get("http://localhost:9000/user/allInfos").then((response) => {
        //console.log(response.data);
        this.users = response.data;
      });
    },
    intervalFetchData: function () {
      setInterval(() => {
        this.getTableData();
      }, 8000);
    },
  },
  mounted() {
    // Run the functions once when mounted
    this.getTableData();
    // get state function ect.
    // Run the intervalFetchData function once to set the interval time for later refresh
    //this.intervalFetchData();
  },
};
</script>
