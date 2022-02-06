<template>
  <div class="select-input">
    <select v-model="select" class="select-input__select">
      <slot />
    </select>
    <input v-model="input" class="select-input__input" />
  </div>
</template>

<script>
export default {
    models: [
        { data: "select", event: "models:select" },   
        { data: "input", event: "models:input" },   
    ],

    data() {
        return {
            select: undefined,
            input: "",
        }
    },

    watch: {
        select(newVal) {
            this.$emit("models:select", newVal);
        },

        input(newVal) {
            this.$emit("models:input", newVal);
        },
    }
};
</script>

<style>
.select-input {
  border: solid 1px #e2e2e2;
  max-width: 250px;
  font-size: 14px;
  padding: 5px 6px;
}

.select-input__select {
  border: none;
  background: none;
  max-width: 69px;
}

.select-input__input {
  border: none;
  width: 180px;
  border: none;
  outline: none;
}
</style>