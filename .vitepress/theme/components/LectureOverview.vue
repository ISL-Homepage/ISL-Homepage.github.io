<script setup lang="ts">
import { withBase } from 'vitepress'
import { data } from '../../../data/lectures.data'
import type { Course, Semester } from '../../../data/lectures.data'
import { isEnded } from '../lecture'

// 최신 연도의 1학기, 2학기만 보여 준다. 지난 학기 파일은 data/lectures/ 에 그대로 남는다.
const SEMESTERS: { key: Semester; label: string }[] = [
  { key: 'spring', label: '1학기' },
  { key: 'fall', label: '2학기' }
]
const year = data.latestYear
const termOf = (s: Semester) => data.terms.find((t) => t.year === year && t.semester === s)
const coursesOf = (s: Semester) => termOf(s)?.courses ?? []
const ended = (s: Semester) => {
  const t = termOf(s)
  return t ? isEnded(t) : false
}
const empty = (c: Course) => !c.materials.length && !c.notices.length
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
        <div class="head">
          <strong class="title">{{ c.title }}</strong>
          <span v-if="ended(s.key)" class="status">종강</span>
          <span v-else-if="empty(c)" class="status">준비 중</span>
        </div>
        <p v-if="c.desc" class="desc">{{ c.desc }}</p>
        <template v-if="ended(s.key)">
          <p class="desc">{{ year + 1 }}년 {{ s.label }}에 다시 열립니다.</p>
        </template>
        <template v-else-if="!empty(c)">
          <p v-if="latest(c)" class="latest">최근 공지: {{ latest(c)!.title }}</p>
          <div class="meta">
            <span v-if="c.materials.length">자료 {{ c.materials.length }}</span>
            <span v-if="c.notices.length">공지 {{ openCount(c) }} / {{ c.notices.length }} 공개</span>
          </div>
        </template>
        <p v-else class="desc">강의 자료와 공지는 개강 후 올라옵니다.</p>
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
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.title {
  font-size: 17px;
}
.status {
  flex-shrink: 0;
  padding: 1px 10px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  font-size: 12px;
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
