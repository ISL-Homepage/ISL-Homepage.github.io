<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// 페이지 안 PDF 뷰어. 여는 쪽에서 v-if 로 붙였다 뗀다.
const props = defineProps<{ url: string; title: string; subtitle?: string }>()
const emit = defineEmits<{ close: [] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div class="viewer-backdrop" @click.self="emit('close')">
      <div class="viewer" role="dialog" aria-modal="true" :aria-label="props.title">
        <header>
          <div class="viewer-title">
            <strong>{{ props.title }}</strong>
            <span v-if="props.subtitle">{{ props.subtitle }}</span>
          </div>
          <div class="viewer-actions">
            <a :href="props.url" target="_blank" rel="noopener">새 탭에서 열기</a>
            <a :href="props.url" download>다운로드</a>
            <button aria-label="닫기" @click="emit('close')">✕</button>
          </div>
        </header>
        <iframe :src="props.url" :title="props.title" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.viewer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.6);
}
.viewer {
  display: flex;
  flex-direction: column;
  width: min(1100px, 100%);
  height: min(90vh, 900px);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}
.viewer header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.viewer-title {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.viewer-title strong {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.viewer-title span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.viewer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.viewer-actions a {
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}
.viewer-actions a:hover {
  color: var(--vp-c-brand-1);
}
.viewer-actions button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 16px;
  color: var(--vp-c-text-2);
}
.viewer-actions button:hover {
  background: var(--vp-c-default-soft);
}
.viewer iframe {
  flex: 1;
  width: 100%;
  border: 0;
  background: #525659;
}
</style>
