<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

// index.md front matter의 showcase 목록을 hero 오른쪽에서 차례로 보여 준다.
// duration(초)을 적으면 그 슬라이드만 그만큼 머문다. GIF는 한 바퀴 길이로 맞추면 된다.
interface Slide {
  src: string
  caption?: string
  link?: string
  duration?: number
}

const { frontmatter } = useData()
const slides = computed<Slide[]>(() => frontmatter.value.showcase ?? [])
const defaultSeconds = computed(() => frontmatter.value.showcaseInterval ?? 5)

const current = ref(0)
// 슬라이드가 바뀔 때마다 증가시켜 GIF를 처음부터 다시 재생한다.
const plays = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
let autoplay = false

function show(i: number) {
  current.value = i
  plays.value++
  schedule()
}

function schedule() {
  clearTimeout(timer)
  if (!autoplay || slides.value.length < 2) return
  const seconds = slides.value[current.value]?.duration ?? defaultSeconds.value
  timer = setTimeout(() => show((current.value + 1) % slides.value.length), seconds * 1000)
}

function pause() {
  clearTimeout(timer)
}

onMounted(() => {
  autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  schedule()
})
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div v-if="slides.length" class="showcase" @mouseenter="pause" @mouseleave="schedule">
    <div class="frame">
      <component
        :is="s.link ? 'a' : 'div'"
        v-for="(s, i) in slides"
        :key="s.src"
        :href="s.link && withBase(s.link)"
        class="slide"
        :class="{ active: i === current }"
        :aria-hidden="i !== current"
      >
        <img
          :key="i === current ? plays : -1"
          :src="withBase(s.src)"
          :alt="s.caption || ''"
          :loading="i === 0 ? 'eager' : 'lazy'"
        />
      </component>
    </div>
    <div class="footer">
      <span class="caption">{{ slides[current]?.caption }}</span>
      <span v-if="slides.length > 1" class="dots">
        <button
          v-for="(s, i) in slides"
          :key="s.src"
          :class="{ active: i === current }"
          :aria-label="s.caption || `${i + 1}번째`"
          @click="show(i)"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  position: relative;
  width: min(100%, 520px);
  padding: 10px;
  border-radius: 16px;
  /* 연구 그림 배경이 흰색이라 다크 모드에서도 흰 카드로 둔다 */
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 40px rgba(120, 20, 20, 0.18);
  backdrop-filter: blur(4px);
}
.frame {
  position: relative;
  aspect-ratio: 2.3 / 1;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}
.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
}
.slide.active {
  opacity: 1;
}
.slide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 6px 2px;
}
.caption {
  font-size: 14px;
  font-weight: 600;
  color: #3c3c43;
}
.dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.dots button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9d9de;
  transition: background 0.3s, width 0.3s;
}
.dots button.active {
  width: 20px;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
}
@media (prefers-reduced-motion: reduce) {
  .slide {
    transition: none;
  }
}
</style>
