<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as years } from '../../../data/seminars.data'

const fileUrl = (file: string) => withBase(encodeURI(`/attachments/seminar/${file}`).replace(/#/g, '%23'))
const total = years.reduce((n, y) => n + y.items.length, 0)
</script>

<template>
  <p class="seminar-total">총 {{ total }}건</p>
  <section v-for="y in years" :key="y.year">
    <h2 :id="`y${y.year}`" tabindex="-1">
      {{ y.year }}년
      <a class="header-anchor" :href="`#y${y.year}`" :aria-label="`${y.year}년`">&#8203;</a>
    </h2>
    <ul class="seminar-list">
      <li v-for="s in y.items" :key="s.date + s.title">
        <div class="seminar-head">
          <strong>{{ s.title }}</strong>
          <span class="seminar-meta">{{ s.date.replace(/-/g, '.') }} · {{ s.speaker }}</span>
        </div>
        <p v-if="s.desc" class="seminar-desc">{{ s.desc }}</p>
        <a v-if="s.file" :href="fileUrl(s.file)" target="_blank" rel="noopener">발표 자료 (PDF)</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.seminar-total {
  color: var(--vp-c-text-2);
}
.seminar-list {
  list-style: none;
  padding-left: 0;
}
.seminar-list li {
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.seminar-head {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  align-items: baseline;
}
.seminar-meta {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.seminar-desc {
  margin: 4px 0;
  color: var(--vp-c-text-2);
}
</style>
