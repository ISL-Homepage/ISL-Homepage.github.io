import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HeroShowcase from './components/HeroShowcase.vue'
import PeopleGrid from './components/PeopleGrid.vue'
import SeminarList from './components/SeminarList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroShowcase)
    }),
  enhanceApp({ app }) {
    app.component('PeopleGrid', PeopleGrid)
    app.component('SeminarList', SeminarList)
  }
} satisfies Theme
