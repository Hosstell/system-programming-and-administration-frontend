<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title>
        Выберите корзину
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <basket-select ref="basketSelect" @choicedBasket="setBasket"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text :disabled="!basket" @click="deleteFile">
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BasketSelect from "@/components/BasketSelect"
import axios from 'axios'

export default {
  name: "BasketSelectDialog",
  components: {BasketSelect},
  data() {
    return {
      dialog: false,
      basket: null,
      file: null
    }
  },
  methods: {
    openDialog(file) {
      console.log(file)
      this.dialog = true
      this.file = file
    },
    closeDialog() {
      this.dialog = false
      this.basket = null
      this.file = null
      this.$refs.basketSelect.choicedBasket = null
    },
    setBasket(newVal) {
      this.basket = newVal
    },
    deleteFile() {
      axios.get(`http://localhost:8888/move_file?old=${this.file.path}&new=${this.basket}`).then(response => {
        this.closeDialog()
        this.$emit('success')
      })
    }
  }
}
</script>

<style scoped>

</style>