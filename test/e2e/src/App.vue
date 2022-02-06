<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <div class="center">
      <div class="section">
        <SelectInput v-model-destruct:input="amount" v-model-destruct:select="currency">
          <option value="NGN">NGN</option>
          <option value="GHS">GHS</option>
          <option value="USD">USD</option>
        </SelectInput>
      </div>

      <div class="section">
        <SelectInput2 v-models:input="amount" v-models:select="currency">
          <option value="KES">KES</option>
          <option value="TZS">TZS</option>
          <option value="SLL">SLL</option>
        </SelectInput2>
      </div>
    </div>

    <!-- <router-view/> -->
  </div>
</template>

<script>
import SelectInput from "./components/SelectInput.vue";
import SelectInput2 from "./components/SelectInput2.vue";

export default {
  components: {
    SelectInput,
    SelectInput2
  },

  data() {
    return {
      amount: 300,
      currency: "GHS",
      binded: {},
    }
  }
}
</script>

<style>
.center {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.section {
  margin-bottom: 120px;
  display: block;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
