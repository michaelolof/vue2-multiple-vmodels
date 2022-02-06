# Vue2 Multipe V-Models

A multiple v-model implementation for Vue2

Read about it here in detail
https://dev.to/michaelolof_/multiple-v-model-for-the-rest-of-us-1pb8

----------------------------

## Installation
```bash
$ npm install --save vue2-multiple-vmodels
```
In main.js file
```js
import Vue from "vue"
import Vue2MultipleVModels from "vue2-multiple-vmodels";

Vue.use(Vue2MultipleVModels);
```

## API

The library comes with 2 helper directives.
- `v-models` - Multiple 2 way binding for vue2
- `v-model-destruct` - Destructure a `v-model` object and bind directly to its fields

------------------------------

### v-models
The v-models directive gives you the power of multiple v-models just like in the new vue 3 feature.
You can create a component that supports `v-models` like this

`SelectInput.vue`
```html
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
  },
}
</script>
```

This component can then be used like this

```html
<template>
  <SelectInput v-models:input="amount" v-models:select="currency">
</template>

<script>
export default {
    data() {
        return {
            input: 100,
            currency: "GHS"
        }
    }
}
</script>
```

**Caveats**
- Only works with custom components.
- `v-models` relies on data not props. Props can still be used to sync data the traditional way, but we register the `data` and the `event` not the `prop`
- All `v-models` events must be of the format with `models:<xxx>` The `v-models` directive checks for this.
- Registeration of data and event is done in the `models` section when defining the component. `models` must be an array.

-----------------------------------

### v-model-destruct
Use full for existing/already defined components which emit objects.

Take a `PhoneCountry` component which emits an object as shown below
`PhoneCountry.vue`
```html
<template>
  <PhoneCountry v-model="phone">
</template>

<script>
export default {
  data() {
      return {
          phone: {
              country: "Nigeria",
              dial: "234",
              phone: "234123456789"
          }
      }
  }
}
</script>
```

`v-model-destruct` allows you bind (2-way binding) directly to any of the fields you're interested in. E.g

```html
<template>
  <PhoneCountry v-model-destruct:country="country" v-model-destruct:phone="phone" />
</template>

<script>
export default {
    data() {
        return {
            country: "Nigeria",
            phone: "234123456789"
        }
    }
}
</script>
```

**Caveats**
- Only works with Components that emit objects or the value of v-model is an object.
- 2-way binding is limited to component design. If your component (E.g PhoneCountry) is not designed to track changes in object fields (E.g country field), changes made when you update country from the parent component might not update the child (PhoneCountry) component.