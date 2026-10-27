import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import EquipmentGrid from './components/EquipmentGrid.vue'
import HeroShowcase from './components/HeroShowcase.vue'
import PeopleGrid from './components/PeopleGrid.vue'
import PublicationList from './components/PublicationList.vue'
import SeminarList from './components/SeminarList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroShowcase)
    }),
  enhanceApp({ app }) {
    app.component('EquipmentGrid', EquipmentGrid)
    app.component('PeopleGrid', PeopleGrid)
    app.component('PublicationList', PublicationList)
    app.component('SeminarList', SeminarList)
  }
} satisfies Theme
