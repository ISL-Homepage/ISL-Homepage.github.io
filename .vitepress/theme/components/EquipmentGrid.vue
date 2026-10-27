<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as items } from '../../../data/equipment.data'

const LABEL = { camera: 'Camera', sensor: 'Sensor', computing: 'Computing' } as const
const photoUrl = (photo: string) => withBase(encodeURI(`/images/equipment/${photo}`))
</script>

<template>
  <div class="equipment">
    <article v-for="e in items" :key="e.name" class="item">
      <div class="photo">
        <img v-if="e.photo" :src="photoUrl(e.photo)" :alt="e.name" loading="lazy" />
      </div>
      <div class="body">
        <span v-if="e.category" class="chip" :class="e.category">{{ LABEL[e.category] }}</span>
        <h3 class="name">{{ e.name }}</h3>
        <ul v-if="e.specs?.length">
          <li v-for="s in e.specs" :key="s">{{ s }}</li>
        </ul>
      </div>
    </article>
  </div>
</template>

<style scoped>
.equipment {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.item {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.photo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  padding: 16px;
  /* 장비 사진 배경이 흰색이라 다크 모드에서도 흰 바탕 */
  background: #fff;
}
.photo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.body {
  padding: 14px 16px 16px;
}
.chip {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
.chip.camera {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.chip.sensor {
  background: var(--pub-conf-soft);
  color: var(--pub-conf);
}
.vp-doc .name {
  margin: 8px 0 6px;
  padding: 0;
  border: 0;
  font-size: 16px;
}
.vp-doc ul {
  margin: 0;
  padding-left: 18px;
}
.vp-doc li {
  margin: 2px 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
}
</style>
