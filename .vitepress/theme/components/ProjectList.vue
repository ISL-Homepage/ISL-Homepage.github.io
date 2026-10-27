<script setup lang="ts">
import { withBase } from 'vitepress'
import { data } from '../../../data/projects.data'
import type { Project } from '../../../data/projects.data'

const { ongoing, done, books } = data

const ym = (d?: string) => (d ? d.slice(0, 7).replace('-', '.') : '')
const months = (p: Project) => {
  if (!p.start || !p.end) return 0
  const days = (Date.parse(p.end) - Date.parse(p.start)) / 86400000
  return Math.max(1, Math.round(days / 30.44))
}
const period = (p: Project) => (p.start ? `${ym(p.start)} – ${p.end ? ym(p.end) : '현재'}` : '')

// 끝난 과제를 시작 연도별로 묶는다
const years = (() => {
  const map = new Map<string, Project[]>()
  for (const p of done) {
    const y = p.start?.slice(0, 4) ?? '기타'
    if (!map.has(y)) map.set(y, [])
    map.get(y)!.push(p)
  }
  return [...map].map(([year, items]) => ({ year, items }))
})()
</script>

<template>
  <!-- 진행 중인 과제는 있을 때만 보여 준다 (비어 있으면 칸 자체를 숨김) -->
  <div class="stats" :class="{ two: !ongoing.length }">
    <a v-if="ongoing.length" class="stat" href="#ongoing">
      <span class="num">{{ ongoing.length }}</span>
      <span class="label">진행 중인 과제</span>
    </a>
    <a class="stat" href="#done">
      <span class="num">{{ done.length }}</span>
      <span class="label">수행한 과제</span>
    </a>
    <a class="stat" href="#books">
      <span class="num">{{ books.length }}</span>
      <span class="label">저서</span>
    </a>
  </div>

  <h2 v-if="ongoing.length" id="ongoing" tabindex="-1">
    진행 중인 과제
    <a class="header-anchor" href="#ongoing" aria-label="진행 중인 과제">&#8203;</a>
  </h2>
  <div v-if="ongoing.length" class="ongoing">
    <article v-for="p in ongoing" :key="p.title" class="live">
      <span class="live-badge"><i />진행 중</span>
      <strong>{{ p.title }}</strong>
      <p class="org">
        {{ p.org }}<template v-if="p.program"> · {{ p.program }}</template>
      </p>
      <p v-if="p.start" class="when">{{ period(p) }}</p>
    </article>
  </div>

  <h2 id="done" tabindex="-1">
    수행한 과제
    <a class="header-anchor" href="#done" aria-label="수행한 과제">&#8203;</a>
  </h2>
  <div class="timeline">
    <section v-for="y in years" :key="y.year" class="year">
      <span class="year-label">{{ y.year }}</span>
      <div class="items">
        <article v-for="p in y.items" :key="p.title + p.start" class="item">
          <strong>{{ p.title }}</strong>
          <div class="meta">
            <span class="org-chip">{{ p.org }}</span>
            <span v-if="p.program" class="program">{{ p.program }}</span>
            <span class="period">
              {{ period(p) }}<template v-if="months(p)"> · {{ months(p) }}개월</template>
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>

  <h2 id="books" tabindex="-1">
    저서
    <a class="header-anchor" href="#books" aria-label="저서">&#8203;</a>
  </h2>
  <div class="books">
    <component
      :is="b.url ? 'a' : 'article'"
      v-for="b in books"
      :key="b.title"
      class="book"
      :class="{ link: b.url }"
      :href="b.url"
      :target="b.url ? '_blank' : undefined"
      :rel="b.url ? 'noopener' : undefined"
    >
      <img v-if="b.cover" class="cover-img" :src="withBase(`/images/books/${b.cover}`)" :alt="`${b.title} 표지`" loading="lazy" />
      <div v-else class="cover" aria-hidden="true">
        <span>{{ b.title }}</span>
      </div>
      <div class="book-body">
        <strong>{{ b.title }}</strong>
        <p class="authors">{{ b.authors }}</p>
        <p class="pub">{{ b.publisher }} · {{ b.date.replace(/-/g, '.') }}</p>
        <p v-if="b.isbn" class="isbn">ISBN {{ b.isbn }}</p>
        <span v-if="b.url" class="more">자세히 보기 ↗</span>
      </div>
    </component>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.stats.two {
  grid-template-columns: repeat(2, 1fr);
}
.vp-doc .stat {
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s;
}
.vp-doc .stat:hover {
  border-color: var(--vp-c-brand-1);
}
.num {
  color: var(--vp-c-brand-1);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}
.label {
  color: var(--vp-c-text-2);
  font-size: 13px;
}
/* 진행 중 */
.ongoing {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
.live {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 20px 22px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 100% 0%, rgba(71, 202, 255, 0.16), transparent 55%),
    radial-gradient(circle at 0% 100%, rgba(189, 52, 254, 0.1), transparent 60%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-soft);
}
.live strong {
  font-size: 18px;
  line-height: 1.45;
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
}
.live-badge i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}
.vp-doc .live p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
}

/* 수행한 과제 타임라인 */
.timeline {
  margin-top: 16px;
}
.year {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 16px;
}
.year-label {
  position: sticky;
  top: calc(var(--vp-nav-height) + 16px);
  align-self: start;
  padding-top: 14px;
  color: var(--vp-c-brand-1);
  font-size: 15px;
  font-weight: 700;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 0 18px 20px;
  border-left: 2px solid var(--vp-c-divider);
}
.year:last-child .items {
  padding-bottom: 0;
}
.item {
  position: relative;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}
.item:hover {
  border-color: var(--vp-c-brand-1);
}
.item::before {
  content: '';
  position: absolute;
  top: 20px;
  left: -28px;
  width: 10px;
  height: 10px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  background: var(--vp-c-bg);
}
.item strong {
  display: block;
  font-size: 15px;
  line-height: 1.5;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  margin-top: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.org-chip {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.period {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

/* 저서 */
.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.vp-doc .book {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.vp-doc .book.link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.cover-img {
  flex: 0 0 84px;
  width: 84px;
  height: 116px;
  object-fit: cover;
  border-radius: 3px 6px 6px 3px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}
.more {
  display: inline-block;
  margin-top: 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 500;
}
.cover {
  position: relative;
  flex: 0 0 72px;
  height: 100px;
  display: flex;
  align-items: flex-end;
  padding: 8px 6px 8px 12px;
  border-radius: 3px 6px 6px 3px;
  background: linear-gradient(135deg, #5b6cff, #bd34fe 60%, #47caff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.cover::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: rgba(0, 0, 0, 0.18);
}
.cover span {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.3;
}
.book-body {
  min-width: 0;
}
.book-body strong {
  font-size: 15px;
  line-height: 1.45;
}
.vp-doc .book-body p {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.vp-doc .book-body .isbn {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
  .stats.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .num {
    font-size: 22px;
  }
  .year {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .year-label {
    position: static;
    padding-top: 0;
  }
  .period {
    margin-left: 0;
  }
}
</style>
