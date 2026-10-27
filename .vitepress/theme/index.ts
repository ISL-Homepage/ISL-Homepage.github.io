import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeBanner from './components/HomeBanner.vue'
import PeopleGrid from './components/PeopleGrid.vue'
import SeminarList from './components/SeminarList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-after': () => h(HomeBanner)
    }),
  enhanceApp({ app }) {
    app.component('PeopleGrid', PeopleGrid)
    app.component('SeminarList', SeminarList)
  }
} satisfies Theme
