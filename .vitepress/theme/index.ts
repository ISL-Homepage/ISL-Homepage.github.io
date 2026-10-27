import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import EquipmentGrid from './components/EquipmentGrid.vue'
import HeroShowcase from './components/HeroShowcase.vue'
import LectureCourse from './components/LectureCourse.vue'
import LectureOverview from './components/LectureOverview.vue'
import PeopleGrid from './components/PeopleGrid.vue'
import ProjectList from './components/ProjectList.vue'
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
    app.component('LectureCourse', LectureCourse)
    app.component('LectureOverview', LectureOverview)
    app.component('PeopleGrid', PeopleGrid)
    app.component('ProjectList', ProjectList)
    app.component('PublicationList', PublicationList)
    app.component('SeminarList', SeminarList)
  }
} satisfies Theme
