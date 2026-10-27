<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

// index.md front matter의 banner: { src, alt, link } 를 hero 아래에 크게 보여 준다.
const { frontmatter } = useData()
const banner = computed(() => frontmatter.value.banner)
</script>

<template>
  <div v-if="banner?.src" class="home-banner">
    <component :is="banner.link ? 'a' : 'div'" :href="banner.link" class="frame">
      <img :src="withBase(banner.src)" :alt="banner.alt || ''" />
    </component>
  </div>
</template>

<style scoped>
/* 아래 카드(VPFeatures)와 같은 폭과 여백 */
.home-banner {
  padding: 0 24px 32px;
}
@media (min-width: 640px) {
  .home-banner {
    padding: 0 48px 48px;
  }
}
@media (min-width: 960px) {
  .home-banner {
    padding: 0 64px 48px;
  }
}
.frame {
  display: block;
  max-width: 1152px;
  margin: 0 auto;
  padding: 12px;
  border-radius: 12px;
  /* GIF 배경이 흰색이라 다크 모드에서도 흰 카드로 감싼다 */
  background: #fff;
  border: 1px solid var(--vp-c-divider);
}
.frame img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
