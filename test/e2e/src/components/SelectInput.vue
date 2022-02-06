<template>
  <div class="select-input">
    <select v-model="value.select" @change="emit" class="select-input__select">
      <slot />
    </select>
    <input v-model="value.input" @input="emit" class="select-input__input" />
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },

  props: {
    value: {
      type: Object,
      default: () => ({
        select: undefined,
        input: undefined,
      }),
    },
  },

  methods: {
      emit() {
          this.$emit("change", this.value);
      }
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