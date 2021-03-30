<template>
  <div class="container">
     <div v-if="filter === ''">      
      <h3 class="p-3 text-left">
        List of all users 
      </h3>
    </div>
    <div v-if="filter !== ''">      
      <h3 class="p-3 text-left">
        Addres to your container: {{ filter }}.germanywestcentral.azurecontainer.io
      </h3>
    </div>
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

          <button @click="btnDetails(user)">Details</button>          
          <template v-if="user.showDetails">
            <ul id="v-for-object" class="demo">
              <li v-for="(value, name) in user.details" :key="value.host">
                  {{ name }}: {{ value }}
              </li>
            </ul>         
          </template>
   
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
          showDetails: true, details: "",
          dns: "accessible-giant-panda"
        },
        { name: "Vic", state: "Pending", showDetails: true, details: "", dns: "vic.reynolds@test.com" },
        { name: "Gina", state: "Pending", showDetails: true, details: "",dns: "gina.jabowski@test.com"},
        { name: "Jessi", state: "Pending", showDetails: true, details: "",dns: "jessi.glaser@test.com" },
        { name: "Jay", state: "Pending", showDetails: true, details: "",dns: "Usjay.bilzerian@test.comer"},
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
    getExtendedDetails: function () {
      this.users.forEach(user => {
        if(user.state === "Running") {
          console.log(user.name)
          let post = {
            username: user.name,
           };
          this.axios.post("http://localhost:9000/container/extendedStatus", post).then((response) => {
            console.log(response.data);
            let details =response.data;

            if(details !== undefined && details !== "")
            {
              user.details = details;

            } else {
              //user.details = "No details available right now";
            }
            
          }).catch(error => console.log(error));
        }
      });
    },  
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
        //this.getExtendedDetails();
      }, 8000);
    },
    btnDetails: function (user) {      
      user.showDetails = !user.showDetails;
      this.getExtendedDetails();
    },
  },
  mounted() {
    // Run the functions once when mounted
    this.getTableData();
    this.getExtendedDetails();
    // get state function ect.
    // Run the intervalFetchData function once to set the interval time for later refresh
    //this.intervalFetchData();
  },
};
</script>
