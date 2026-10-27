<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as pubs } from '../../../data/publications.data'
import type { Publication } from '../../../data/publications.data'

type Kind = Publication['type']
type Scope = Publication['scope']

const TYPE_LABEL: Record<Kind, string> = { journal: 'Journal', conference: 'Conference' }
const SCOPE_LABEL: Record<Scope, string> = { international: '국제', domestic: '국내' }
const GROUPS: { type: Kind; scope: Scope; label: string }[] = [
  { type: 'journal', scope: 'international', label: '국제 저널' },
  { type: 'journal', scope: 'domestic', label: '국내 저널' },
  { type: 'conference', scope: 'international', label: '국제 학술대회' },
  { type: 'conference', scope: 'domestic', label: '국내 학술대회' }
]

const type = ref<Kind | 'all'>('all')
const scope = ref<Scope | 'all'>('all')
const query = ref('')

const count = (t: Kind | 'all', s: Scope | 'all') =>
  pubs.filter((p) => (t === 'all' || p.type === t) && (s === 'all' || p.scope === s)).length

function pick(t: Kind, s: Scope) {
  const same = type.value === t && scope.value === s
  type.value = same ? 'all' : t
  scope.value = same ? 'all' : s
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = pubs.filter(
    (p) =>
      (type.value === 'all' || p.type === type.value) &&
      (scope.value === 'all' || p.scope === scope.value) &&
      (!q || `${p.title ?? ''} ${p.authors ?? ''} ${p.venue ?? ''} ${p.text ?? ''}`.toLowerCase().includes(q))
  )
  const years = new Map<number, Publication[]>()
  for (const p of list) {
    if (!years.has(p.year)) years.set(p.year, [])
    years.get(p.year)!.push(p)
  }
  return [...years].map(([year, items]) => ({ year, items }))
})
const total = computed(() => filtered.value.reduce((n, y) => n + y.items.length, 0))

// 저자 목록에서 교수님 이름 강조
const PROF = /(고윤호|Yun[- ]?[Hh]o Ko|Y\.\s?-?H\.\s?Ko)/g
const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const authorsHtml = (a: string) => escape(a).replace(PROF, '<b>$1</b>')
</script>

<template>
  <div class="stats">
    <button
      v-for="g in GROUPS"
      :key="g.label"
      class="stat"
      :class="[g.type, { on: type === g.type && scope === g.scope }]"
      @click="pick(g.type, g.scope)"
    >
      <span class="num">{{ count(g.type, g.scope) }}</span>
      <span class="label">{{ g.label }}</span>
    </button>
  </div>

  <div class="toolbar">
    <div class="segment" role="group" aria-label="종류">
      <button :class="{ on: type === 'all' }" @click="type = 'all'">전체</button>
      <button :class="{ on: type === 'journal' }" @click="type = 'journal'">Journal</button>
      <button :class="{ on: type === 'conference' }" @click="type = 'conference'">Conference</button>
    </div>
    <div class="segment" role="group" aria-label="구분">
      <button :class="{ on: scope === 'all' }" @click="scope = 'all'">전체</button>
      <button :class="{ on: scope === 'international' }" @click="scope = 'international'">국제</button>
      <button :class="{ on: scope === 'domestic' }" @click="scope = 'domestic'">국내</button>
    </div>
    <input v-model="query" class="search" type="search" placeholder="제목, 저자, 학술지 검색" aria-label="논문 검색" />
  </div>
  <p class="count">{{ total }}편</p>

  <section v-for="y in filtered" :key="y.year">
    <h2 :id="`y${y.year}`" tabindex="-1">
      {{ y.year }}
      <a class="header-anchor" :href="`#y${y.year}`" :aria-label="`${y.year}`">&#8203;</a>
    </h2>
    <ul class="pubs">
      <li v-for="(p, i) in y.items" :key="i" class="pub">
        <div class="chips">
          <span class="chip" :class="p.type">{{ TYPE_LABEL[p.type] }}</span>
          <span class="chip scope" :class="p.scope">{{ SCOPE_LABEL[p.scope] }}</span>
        </div>
        <template v-if="p.title">
          <a v-if="p.url" class="title" :href="p.url" target="_blank" rel="noopener">{{ p.title }}</a>
          <strong v-else class="title">{{ p.title }}</strong>
          <p v-if="p.authors" class="authors" v-html="authorsHtml(p.authors)" />
          <p v-if="p.venue" class="venue">{{ p.venue }}</p>
        </template>
        <p v-else class="authors" v-html="authorsHtml(p.text ?? '')" />
      </li>
    </ul>
  </section>
  <p v-if="!total" class="empty">조건에 맞는 논문이 없습니다.</p>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: left;
  transition: border-color 0.2s, background 0.2s;
}
.stat:hover {
  border-color: var(--vp-c-brand-1);
}
.stat .num {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}
.stat.journal .num {
  color: var(--vp-c-brand-1);
}
.stat.conference .num {
  color: var(--pub-conf);
}
.stat .label {
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.stat.on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}
.segment {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
}
.segment button {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}
.segment button.on {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
.search {
  flex: 1 1 200px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}
.search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.count {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.pubs {
  list-style: none;
  padding-left: 0;
}
.vp-doc .pub {
  margin: 0;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.chips {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}
.chip {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
}
.chip.journal {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.chip.conference {
  background: var(--pub-conf-soft);
  color: var(--pub-conf);
}
.chip.scope {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
.chip.scope.international {
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-1);
}
.title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}
.vp-doc a.title {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.vp-doc a.title:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
.authors,
.venue {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.6;
}
.authors {
  color: var(--vp-c-text-2);
}
.authors :deep(b) {
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.venue {
  color: var(--vp-c-text-3);
  font-style: italic;
}
.empty {
  color: var(--vp-c-text-2);
}
</style>
