<template>
  <div>
    <v-treeview
      :items="treedata"
      dense
      hoverable
      activatable
      :open.sync="open"
      :active.sync="active"
      return-object
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.file">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.file] }}
        </v-icon>
      </template>

      <template v-slot:append="{ item, open }">
        <v-btn icon @click="openDeleteDialog(item)" >
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-treeview>

    <basket-select-dialog ref="basketSelectDialog" @success="update"/>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import BasketSelect from "@/components/BasketSelect";
import BasketSelectDialog from "@/components/BasketSelectDialog";

export default {
  name: "FileList",
  components: {BasketSelectDialog, BasketSelect},
  data() {
    return {
      treedata: [{
          id: 1,
          name: '/',
          path: '/',
          children: [{
            name: 'Загрузка...',
            file: 'loading'
          }]
      }],
      open: [],
      active: [],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
        loading: 'mdi-timer-sand'
      },
      choicedBasket: null
    }
  },
  methods: {
    getChildren(item) {
      axios.get(`http://localhost:8888/file_list?value=${item.path}`).then(response => {
        item.children = []
        response.data.forEach(file => {
          item.children.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.Name,
            path: file.Path,
            file: file.IsFile ? 'txt' : null,
            children: file.IsFile ? [] : [{
              name: 'Загрузка...',
              file: 'loading'
            }]
          })
        })
        item.children.sort(x => x.file)
      })
    },
    setBasket(newVal) {
      console.log(newVal)
      this.choicedBasket = newVal
    },
    moveFile() {
      let item = this.active[0]
      axios.get(`http://localhost:8888/move_file?old=${item.path}&new=${this.choicedBasket}`).then(response => {
        this.getChildren(item)
      })
    },
    openDeleteDialog(item) {
      console.log(item)
      console.log(this.$refs.basketSelectDialog)
      this.$refs.basketSelectDialog.openDialog(item)
    },
    update() {
      this.getChildren(this.open[this.open.length - 1])
    }
  },
  watch: {
    open: function (newVal, oldVal) {
      let choiceVal = _.differenceBy(newVal, oldVal, 'id')
      if (choiceVal.length) {
        this.getChildren(choiceVal[0])
      }
    },
    load(item, open) {
      console.log(item, open)
    }
  }
}
</script>

<style scoped>

</style>