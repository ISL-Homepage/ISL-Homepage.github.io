<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as years } from '../../../data/seminars.data'
import type { Seminar } from '../../../data/seminars.data'
import PdfViewer from './PdfViewer.vue'

const encode = (path: string) => withBase(encodeURI(path).replace(/#/g, '%23'))
const pdfUrl = (s: Seminar) => encode(`/attachments/seminar/${s.file}`)
const thumbUrl = (s: Seminar) => encode(`/thumbs/seminar/${s.file!.replace(/\.pdf$/i, '.webp')}`)

// 필터
const query = ref('')
const year = ref('all')
const speaker = ref('all')

const speakers = computed(() => {
  const count = new Map<string, number>()
  for (const y of years) for (const s of y.items) count.set(s.speaker, (count.get(s.speaker) ?? 0) + 1)
  return [...count].sort((a, b) => b[1] - a[1]).map(([name]) => name)
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return years
    .filter((y) => year.value === 'all' || y.year === year.value)
    .map((y) => ({
      year: y.year,
      items: y.items.filter(
        (s) =>
          (speaker.value === 'all' || s.speaker === speaker.value) &&
          (!q || `${s.title} ${s.speaker} ${s.desc ?? ''}`.toLowerCase().includes(q))
      )
    }))
    .filter((y) => y.items.length)
})
const total = computed(() => filtered.value.reduce((n, y) => n + y.items.length, 0))

function reset() {
  query.value = ''
  year.value = 'all'
  speaker.value = 'all'
}

// PDF 보기: 브라우저 내장 PDF 뷰어가 있으면 페이지 안에서, 없으면 새 탭으로
const viewing = ref<Seminar | null>(null)
const canEmbed = ref(false)

onMounted(() => {
  canEmbed.value = navigator.pdfViewerEnabled === true && window.innerWidth >= 768
})

function open(s: Seminar, e: MouseEvent) {
  if (!s.file || !canEmbed.value || e.ctrlKey || e.metaKey || e.shiftKey) return
  e.preventDefault()
  viewing.value = s
}
</script>

<template>
  <div class="toolbar">
    <input v-model="query" class="search" type="search" placeholder="제목, 발표자, 내용 검색" aria-label="세미나 검색" />
    <select v-model="speaker" class="speaker" aria-label="발표자">
      <option value="all">발표자 전체</option>
      <option v-for="name in speakers" :key="name" :value="name">{{ name }}</option>
    </select>
  </div>
  <div class="chips" role="group" aria-label="연도">
    <button :class="{ on: year === 'all' }" @click="year = 'all'">전체</button>
    <button v-for="y in years" :key="y.year" :class="{ on: year === y.year }" @click="year = y.year">
      {{ y.year }}
    </button>
  </div>
  <p class="count">
    {{ total }}건
    <button v-if="query || year !== 'all' || speaker !== 'all'" class="reset" @click="reset">필터 지우기</button>
  </p>

  <section v-for="y in filtered" :key="y.year">
    <h2 :id="`y${y.year}`" tabindex="-1">
      {{ y.year }}년
      <a class="header-anchor" :href="`#y${y.year}`" :aria-label="`${y.year}년`">&#8203;</a>
    </h2>
    <div class="grid">
      <a
        v-for="s in y.items"
        :key="s.date + s.title"
        class="card"
        :href="s.file ? pdfUrl(s) : undefined"
        target="_blank"
        rel="noopener"
        @click="open(s, $event)"
      >
        <div class="thumb">
          <img
            v-if="s.file"
            :src="thumbUrl(s)"
            alt=""
            loading="lazy"
            @error="($event.target as HTMLImageElement).style.visibility = 'hidden'"
          />
          <span class="badge">PDF</span>
        </div>
        <div class="body">
          <strong class="title">{{ s.title }}</strong>
          <p v-if="s.desc" class="desc">{{ s.desc }}</p>
          <div class="meta">
            <span class="speaker-chip">{{ s.speaker }}</span>
            <time :datetime="s.date">{{ s.date.replace(/-/g, '.') }}</time>
          </div>
        </div>
      </a>
    </div>
  </section>
  <p v-if="!total" class="empty">조건에 맞는 세미나가 없습니다.</p>

  <PdfViewer
    v-if="viewing"
    :url="pdfUrl(viewing)"
    :title="viewing.title"
    :subtitle="`${viewing.speaker}, ${viewing.date.replace(/-/g, '.')}`"
    @close="viewing = null"
  />
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.search,
.speaker {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}
.search {
  flex: 1 1 220px;
}
.speaker {
  flex: 0 0 auto;
}
.search:focus,
.speaker:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.chips button {
  padding: 4px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}
.chips button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.chips button.on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}
.count {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.reset {
  color: var(--vp-c-brand-1);
  font-size: 13px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.vp-doc .card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
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
.thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}
.body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
  padding: 12px 14px 14px;
}
.title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 15px;
  line-height: 1.4;
}
.desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
}
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.speaker-chip {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.empty {
  color: var(--vp-c-text-2);
}
</style>
