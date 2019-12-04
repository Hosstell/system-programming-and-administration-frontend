<template>
  <div>
    <v-autocomplete
      v-model="choicedBasket"
      label="Корзина"
      :items="items"
      item-text="Name"
    />
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "BasketSelect",
    data() {
      return {
        items: [],
        choicedBasket: null
      }
    },
    mounted() {
      axios.get('http://localhost:8888/file_list?value=/home/andrey/baskets/').then(response => {
        this.items = response.data
      })
    },
    watch: {
      choicedBasket: function (newVal) {
        this.$emit('choicedBasket', newVal)
      }
    }
  }
</script>

<style scoped>

</style>