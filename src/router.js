import Vue from 'vue'
import Router from 'vue-router'
import Base from './views/Base.vue'

import map from '@/components/map.vue'
import sidebar_view from '@/components/sidebar.view.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Base,
      children: [
        {
          path: '/',
          name: 'view',
          components: {
            map: map,
            sidebar: sidebar_view
          }
        }
      ]
    }
  ]
})
