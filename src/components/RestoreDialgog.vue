<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title>
        Введите новый путь
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          lable="Путь"
          v-model="newPath"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text :disabled="!newPath" @click="restoreFile">
          Востановить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import BasketSelect from "@/components/BasketSelect"
  import axios from 'axios'

  export default {
    name: "RestoreDialog",
    components: {BasketSelect},
    data() {
      return {
        dialog: false,
        newPath: null,
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
        this.newPath = null
        this.file = null
      },
      restoreFile() {
        axios.get(`http://localhost:8888/restore_file?old=${this.file.path}&new=${this.newPath}`).then(response => {
          this.closeDialog()
          this.$emit('success')
        })
      }
    }
  }
</script>

<style scoped>

</style>