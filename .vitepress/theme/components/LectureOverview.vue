<script setup lang="ts">
import { withBase } from 'vitepress'
import { data } from '../../../data/lectures.data'
import type { Course, Semester } from '../../../data/lectures.data'

// 최신 연도의 1학기, 2학기만 보여 준다. 지난 학기 파일은 data/lectures/ 에 그대로 남는다.
const SEMESTERS: { key: Semester; label: string }[] = [
  { key: 'spring', label: '1학기' },
  { key: 'fall', label: '2학기' }
]
const year = data.latestYear
const coursesOf = (s: Semester) => data.terms.find((t) => t.year === year && t.semester === s)?.courses ?? []
const openCount = (c: Course) => c.notices.filter((n) => n.open).length
const latest = (c: Course) => c.notices.filter((n) => n.open).at(-1)
</script>

<template>
  <section v-for="s in SEMESTERS" :key="s.key">
    <h2 :id="s.key" tabindex="-1">
      {{ year }} {{ s.label }}
      <a class="header-anchor" :href="`#${s.key}`" :aria-label="`${year} ${s.label}`">&#8203;</a>
    </h2>
    <div v-if="coursesOf(s.key).length" class="grid">
      <a v-for="c in coursesOf(s.key)" :key="c.id" class="card" :href="withBase(`/lecture/${c.id}`)">
        <strong class="title">{{ c.title }}</strong>
        <p v-if="c.desc" class="desc">{{ c.desc }}</p>
        <p v-if="latest(c)" class="latest">최근 공지: {{ latest(c)!.title }}</p>
        <div class="meta">
          <span v-if="c.materials.length">자료 {{ c.materials.length }}</span>
          <span v-if="c.notices.length">공지 {{ openCount(c) }} / {{ c.notices.length }} 공개</span>
          <span v-if="!c.materials.length && !c.notices.length">준비 중</span>
        </div>
      </a>
    </div>
    <p v-else class="empty">개설된 강의가 없습니다.</p>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.vp-doc .card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.vp-doc .card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.title {
  font-size: 17px;
}
.desc,
.latest {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
}
.latest {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
.meta {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.empty {
  color: var(--vp-c-text-2);
}
</style>
