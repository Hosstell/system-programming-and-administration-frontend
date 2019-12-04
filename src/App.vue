<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          @click="closeNavigator"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-btn icon @click="drawer = true">
        <v-icon>
          mdi-menu
        </v-icon>
      </v-btn>
      <v-toolbar-title v-text="'Твоя корзина'"/>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import FileList from "@/components/FileList";

export default {
  name: 'App',
  components: {
      FileList,
  },
  data: () => ({
    drawer: false,
    items: [{
      title: 'Файлы',
      icon: 'mdi-file-multiple',
      to: '/file_list'
    },{
      title: 'Корзины',
      icon: 'mdi-delete-restore',
      to: '/basket_list'
    }]
  }),
  methods: {
    closeNavigator() {
      this.drawer = false
    },
    makeRequest() {
      console.log('привет')
      axios.get('http://localhost:8888').then(function (response) {
        // handle success
        console.log(response);
      })
    },
    open(elems) {
      console.log(elems)
    }
  }
};
</script>
