import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PeopleGrid from './components/PeopleGrid.vue'
import SeminarList from './components/SeminarList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PeopleGrid', PeopleGrid)
    app.component('SeminarList', SeminarList)
  }
} satisfies Theme
