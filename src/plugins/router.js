import VueRouter from 'vue-router';
import FileList from "@/components/FileList";
import BasketList from "@/components/BasketList";
import Vue from "vue";

Vue.use(VueRouter)

const routes = [
  { path: '/file_list', component: FileList },
  { path: '/basket_list', component: BasketList },
]

export default new VueRouter({
  routes
})