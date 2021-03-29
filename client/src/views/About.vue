<template>
  <div class="about">
    <div>
      <b-jumbotron>
        <template #header>Cloudboys</template>       

        <hr class="my-4">

        <p>
          Get your own Minecraft container.
        </p>
        <div>
          <b-button @click="btnLogin" variant="primary" href="#">Login</b-button>
          <b-button @click="btnRegister" variant="warning" href="#">Register</b-button>
        </div>

        
      </b-jumbotron>
    </div>
  
  </div> 
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      title: "flop",
    };
  },
  methods: {
    btnLogin: function() {
      alert("hey");
      },
    btnRegister: function() {
    alert("hey btnRegister");
    this.axios.post('http://localhost:9000/user/users').then((response) => {
        console.log(response.data)
        this.users = response.data;
      })
    },
  },
};
</script>