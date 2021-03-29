<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/mevn.jpg" width="350" />
    <HelloWorld msg="Default Boilerplate TTemplate" />
    <p>{{ title }}</p>

    <button @click="title = 'something eeelse'">Hier</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  data() {
    return {
      title: "flop",
    };
  },
  components: {
    HelloWorld,
  },
};
</script>
