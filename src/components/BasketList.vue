<template>
  <div>
    <v-btn @click="openCreateBasketDialog = true" class="ma-5">
      Добавить новую корзину
    </v-btn>

    <v-dialog v-model="openCreateBasketDialog" width="400">
      <v-card>
        <v-card-title>
          Новая корзина
          <v-spacer />
          <v-btn icon @click="openCreateBasketDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Имя новой корзины"
            v-model="newBasketName"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text :disabled="!newBasketName" @click="createNewBasket">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteBasketDialog" width="400">
      <v-card>
        <v-card-title>
          Удаление корзины
          <v-spacer />
          <v-btn icon @click="deleteBasketDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить корзину
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="openDeleteBasketDialogNo">
            Отмена
          </v-btn>
          <v-btn text @click="deleteBasket">
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-treeview
      :items="treedata"
      dense
      hoverable
      activatable
      :open.sync="open"
      :active.sync="active"
      return-object
      class="ml-3"
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
        <v-btn v-if="item.isBasket" icon @click="openDeleteBasketDialog(item)" >
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn v-else icon @click="openRestoreDialog(item)" >
          <v-icon>
            mdi-open-in-new
          </v-icon>
        </v-btn>
      </template>
    </v-treeview>

    <restore-dialog ref="RestoreDialog" @success="update"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  import axios from 'axios'
  import RestoreDialog from "@/components/RestoreDialgog";

  export default {
    name: "BasketList",
    components: {RestoreDialog},
    data() {
      return {
        treedata: [{
          id: 1,
          name: 'Корзины',
          path: '/home/andrey/baskets',
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
        openCreateBasketDialog: false,
        newBasketName: '',
        deleteBasketDialog: false
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
              isBasket: item.name === 'Корзины',
              children: file.IsFile ? [] : [{
                name: 'Загрузка...',
                file: 'loading'
              }]
            })
          })
          item.children.sort(x => x.file)
        })
      },
      createNewBasket() {
        axios.get(`http://localhost:8888/new_basket?value=${this.newBasketName}`).then(response => {
          this.openCreateBasketDialog = false
          this.getChildren(this.treedata[0])
        })
      },
      openRestoreDialog(file) {
        this.$refs.RestoreDialog.openDialog(file)
      },
      update() {
        this.open.forEach(item => this.getChildren(item))
      },
      openDeleteBasketDialog(item) {
        this.deletingBasket = item
        this.deleteBasketDialog = true
      },
      openDeleteBasketDialogNo() {
        this.deletingBasket = null
        this.deleteBasketDialog = false
      },
      deleteBasket() {
        axios.get(`http://localhost:8888/delete?value=${this.deletingBasket.path}`).then(response => {
          this.deleteBasketDialog = false
          this.update()
        })
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