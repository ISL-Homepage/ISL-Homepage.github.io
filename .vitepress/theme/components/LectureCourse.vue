<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../../../data/lectures.data'
import type { LectureFile } from '../../../data/lectures.data'
import PdfViewer from './PdfViewer.vue'

// 이 과목의 최신 연도 학기 데이터. 최신 연도에 없으면 "준비 중"
const props = defineProps<{ id: string }>()

const SEMESTER_LABEL = { spring: '1학기', fall: '2학기' } as const

const found = computed(() => {
  for (const term of data.terms) {
    if (term.year !== data.latestYear) continue
    const course = term.courses.find((c) => c.id === props.id)
    if (course) return { term, course }
  }
  return null
})
const notices = computed(() => found.value?.course.notices ?? [])
const openCount = computed(() => notices.value.filter((n) => n.open).length)
// 가장 마지막에 공개한 공지 (목록 순서 기준)
const latest = computed(() => notices.value.filter((n) => n.open).at(-1))

const encode = (path: string) => withBase(encodeURI(path).replace(/#/g, '%23'))
const fileUrl = (f: LectureFile) => encode(`/attachments/${f.file}`)
const ext = (f: LectureFile) => f.file?.split('.').pop()?.toUpperCase() ?? ''
const isPdf = (f: LectureFile) => ext(f) === 'PDF'

// PDF 보기: 브라우저 내장 PDF 뷰어가 있으면 페이지 안에서, 없으면 새 탭으로
const viewing = ref<LectureFile | null>(null)
const canEmbed = ref(false)
onMounted(() => {
  canEmbed.value = navigator.pdfViewerEnabled === true && window.innerWidth >= 768
})
function open(f: LectureFile, e: MouseEvent) {
  if (!canEmbed.value || e.ctrlKey || e.metaKey || e.shiftKey) return
  e.preventDefault()
  viewing.value = f
}
</script>

<template>
  <template v-if="found">
    <div class="term">
      <span class="term-chip">{{ found.term.year }} · {{ SEMESTER_LABEL[found.term.semester] }}</span>
      <span v-if="notices.length" class="term-meta">공지 {{ openCount }} / {{ notices.length }} 공개</span>
    </div>

    <template v-if="found.course.materials.length">
      <h2 id="materials" tabindex="-1">
        강의 자료
        <a class="header-anchor" href="#materials" aria-label="강의 자료">&#8203;</a>
      </h2>
      <div class="materials">
        <div v-for="m in found.course.materials" :key="m.title" class="material">
          <span class="ext" :class="ext(m).toLowerCase()">{{ ext(m) }}</span>
          <strong>{{ m.title }}</strong>
          <div v-if="m.file" class="actions">
            <a v-if="isPdf(m)" :href="fileUrl(m)" target="_blank" rel="noopener" @click="open(m, $event)">보기</a>
            <a :href="fileUrl(m)" download>다운로드</a>
          </div>
        </div>
      </div>
    </template>

    <h2 id="notices" tabindex="-1">
      주차별 공지
      <a class="header-anchor" href="#notices" aria-label="주차별 공지">&#8203;</a>
    </h2>
    <ol v-if="notices.length" class="notices">
      <li v-for="n in notices" :key="`${n.week}-${n.title}`" :class="{ closed: !n.open, latest: n === latest }">
        <span class="week">{{ n.week ? `${n.week}주차` : '공지' }}</span>
        <span class="notice-title">
          {{ n.title }}
          <span v-if="n === latest" class="new">NEW</span>
        </span>
        <span v-if="!n.open" class="soon">공개 예정</span>
        <div v-else-if="n.file" class="actions">
          <a v-if="isPdf(n)" :href="fileUrl(n)" target="_blank" rel="noopener" @click="open(n, $event)">보기</a>
          <a :href="fileUrl(n)" download>다운로드</a>
        </div>
      </li>
    </ol>
    <p v-else class="empty">아직 올라온 공지가 없습니다.</p>
  </template>
  <p v-else class="empty">{{ data.latestYear }}년 강의 자료는 준비 중입니다.</p>

  <PdfViewer
    v-if="viewing && found"
    :url="fileUrl(viewing)"
    :title="viewing.title"
    :subtitle="`${found.course.title}, ${found.term.year} ${SEMESTER_LABEL[found.term.semester]}`"
    @close="viewing = null"
  />
</template>

<style scoped>
.term {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.term-chip {
  padding: 2px 12px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
}
.term-meta {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.materials {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.material {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.material strong {
  font-size: 15px;
  line-height: 1.4;
}
.material .actions {
  margin-top: auto;
}
.ext {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
}
.ext.pdf {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.ext.hwp {
  background: var(--pub-conf-soft);
  color: var(--pub-conf);
}
.actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.vp-doc .actions a {
  padding: 4px 12px;
  border-radius: 8px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}
.vp-doc .actions a:hover {
  color: var(--vp-c-brand-1);
}
.vp-doc .actions a:first-child:not(:last-child) {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.vp-doc .actions a:first-child:not(:last-child):hover {
  background: var(--vp-c-brand-2);
}
.vp-doc .notices {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}
.vp-doc .notices li {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0;
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
}
.vp-doc .notices li:first-child {
  border-top: 0;
}
.notices li.latest {
  background: var(--vp-c-brand-soft);
}
.notices li.closed {
  color: var(--vp-c-text-3);
}
.week {
  flex: 0 0 52px;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
.closed .week {
  color: var(--vp-c-text-3);
}
.notice-title {
  flex: 1;
  min-width: 0;
  font-size: 15px;
}
.new {
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  vertical-align: 1px;
}
.soon {
  flex-shrink: 0;
  padding: 2px 10px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 999px;
  font-size: 12px;
}
.empty {
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .vp-doc .notices li {
    flex-wrap: wrap;
    gap: 6px 12px;
  }
  .notice-title {
    flex-basis: calc(100% - 64px);
  }
  .notices .actions,
  .soon {
    margin-left: 64px;
  }
}
</style>
