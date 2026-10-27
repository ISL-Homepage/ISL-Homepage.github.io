<script setup lang="ts">
import { withBase } from 'vitepress'

// 구성원 사진. 사진이 없으면 기본 프로필 아바타, crown이면 왕관을 씌운다.
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
    <svg v-if="crown" class="crown" viewBox="0 0 64 44" role="img" aria-label="랩장">
      <path
        d="M6 40 2 10l16 12L32 2l14 20 16-12-4 30z"
        fill="url(#crown-gold)"
        stroke="#9a6a00"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <circle cx="2" cy="10" r="3.5" fill="#f5c542" stroke="#9a6a00" stroke-width="1.5" />
      <circle cx="32" cy="3" r="3.5" fill="#f5c542" stroke="#9a6a00" stroke-width="1.5" />
      <circle cx="62" cy="10" r="3.5" fill="#f5c542" stroke="#9a6a00" stroke-width="1.5" />
      <circle cx="32" cy="28" r="4" fill="#d93a40" />
      <defs>
        <linearGradient id="crown-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe27a" />
          <stop offset="1" stop-color="#e0a516" />
        </linearGradient>
      </defs>
    </svg>
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
  top: calc(var(--size) * -0.24);
  left: 50%;
  width: calc(var(--size) * 0.58);
  transform: translateX(-28%) rotate(18deg);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
  overflow: visible;
}
</style>
