<template>
  <div class="home">
    <div>
      <b-jumbotron>
        <template #header>Cloudboys</template>
        <img alt="Slogan in ASCII" src="../assets/logo_klein.png" width="320" />
        <img alt="Slogan in ASCII" src="../assets/banner.jpg" width="900" />
        <hr class="my-4" />
        <p>Get your own Minecraft container.</p>
        <div>
          <b-button v-b-modal.modal-center variant="primary">Login</b-button>
          <b-button @click="btnRegister" variant="warning" href="#"
            >Register</b-button
          >

          <b-modal id="modal-center" centered title="Login" @ok="btnLogin">
            <input type="text" placeholder="username" v-model="user.username" />
          </b-modal>
        </div>
        <div></div>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  name: "home",
  data() {
    return {
      modalShow: false,
      user: {
        username: "",
      },
    };
  },
  methods: {
    btnLogin: function () {
      this.axios.post("/user/login", this.user).then((response) => {
        //console.log(response.data)
        if (response.data) {
          router.push({
            name: "users",
            params: { filter: this.user.username },
          });
          //this.$router.push({name: 'users', params: { filter: "aware-ape" }})
        }
      });
    },
    btnRegister: function () {
      //alert("hey btnRegister");
      this.axios.post("/user/users").then((/* response */) => {
      
      });
      router.push("users");
    },
  },
};
</script>