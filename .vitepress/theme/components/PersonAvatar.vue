<script setup lang="ts">
import { withBase } from 'vitepress'
import CrownIcon from './CrownIcon.vue'

// 구성원 사진. 사진이 없으면 기본 프로필 아바타, crown이면 오른쪽 위에 왕관 배지를 붙인다.
defineProps<{ name: string; photo?: string; crown?: boolean; size?: number }>()

const photoUrl = (photo: string) => withBase(encodeURI(`/images/people/${photo}`))
</script>

<template>
  <span class="person-avatar" :style="{ '--size': `${size ?? 88}px` }">
    <img v-if="photo" :src="photoUrl(photo)" :alt="name" loading="lazy" />
    <span v-else class="placeholder" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <circle cx="32" cy="25" r="12" />
        <path d="M10 58c2-12 11-19 22-19s20 7 22 19z" />
      </svg>
    </span>
    <span v-if="crown" class="crown" role="img" aria-label="랩장" title="랩장">
      <CrownIcon />
    </span>
  </span>
</template>

<style scoped>
.person-avatar {
  position: relative;
  display: inline-block;
  width: var(--size);
  height: var(--size);
  flex-shrink: 0;
}
.person-avatar img,
.placeholder {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--vp-c-bg), 0 0 0 4px var(--vp-c-divider);
}
.person-avatar img {
  object-fit: cover;
}
.placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  background: var(--vp-c-default-soft);
}
.placeholder svg {
  width: 78%;
  height: 78%;
  fill: var(--vp-c-text-3);
  opacity: 0.55;
}
.crown {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--size) * 0.32);
  height: calc(var(--size) * 0.32);
  border-radius: 50%;
  background: var(--leader-c);
  color: #fff;
  box-shadow: 0 0 0 3px var(--vp-c-bg);
}
.crown svg {
  width: 60%;
  height: 60%;
}
</style>
