<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as groups } from '../../../data/people.data'

const photoUrl = (photo?: string) => withBase(`/images/${photo || 'bio-photo.jpg'}`)
</script>

<template>
  <section v-for="g in groups" :key="g.group">
    <h2 :id="g.group" tabindex="-1">
      {{ g.group }}
      <a class="header-anchor" :href="`#${g.group}`" :aria-label="g.group">&#8203;</a>
    </h2>
    <div class="people-grid">
      <div v-for="p in g.members" :key="p.name" class="person">
        <img :src="photoUrl(p.photo)" :alt="p.name" loading="lazy" />
        <strong>{{ p.name }}</strong>
        <span v-if="p.affiliation">{{ p.affiliation }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 20px;
  margin-top: 16px;
}
.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.person img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 4px;
}
.person span {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.4;
}
</style>
