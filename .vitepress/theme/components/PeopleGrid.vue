<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as groups } from '../../../data/people.data'

const photoUrl = (photo: string) => withBase(encodeURI(`/images/people/${photo}`))
// 사진이 없으면 이름 뒤 두 글자로 아바타를 만든다 (예: 정해밀 -> 해밀)
const initials = (name: string) => (/^[가-힣]{3,}$/.test(name) ? name.slice(1) : name.slice(0, 2))
</script>

<template>
  <section v-for="g in groups" :key="g.group">
    <h2 :id="g.group" tabindex="-1">
      {{ g.group }}
      <span class="count">{{ g.members.length }}</span>
      <a class="header-anchor" :href="`#${g.group}`" :aria-label="g.group">&#8203;</a>
    </h2>
    <div class="people-grid">
      <div v-for="p in g.members" :key="p.name" class="person">
        <img v-if="p.photo" :src="photoUrl(p.photo)" :alt="p.name" loading="lazy" />
        <span v-else class="avatar" aria-hidden="true">{{ initials(p.name) }}</span>
        <strong>{{ p.name }}</strong>
        <span v-if="p.affiliation" class="affiliation">{{ p.affiliation }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.count {
  display: inline-block;
  margin-left: 6px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  line-height: 22px;
  vertical-align: middle;
}
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
  margin-top: 16px;
}
.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 10px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
  transition: border-color 0.2s, transform 0.2s;
}
.person:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.person img,
.avatar {
  width: 88px;
  height: 88px;
  margin-bottom: 4px;
  border-radius: 50%;
}
.person img {
  object-fit: cover;
  box-shadow: 0 0 0 3px var(--vp-c-bg), 0 0 0 4px var(--vp-c-divider);
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--vp-c-brand-soft), rgba(240, 163, 94, 0.18));
  color: var(--vp-c-brand-1);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.person strong {
  font-size: 15px;
}
.affiliation {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
}
</style>
