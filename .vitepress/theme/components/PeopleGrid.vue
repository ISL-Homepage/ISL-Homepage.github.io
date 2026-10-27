<script setup lang="ts">
import { data as groups } from '../../../data/people.data'
import PersonAvatar from './PersonAvatar.vue'

// people.yaml에서 leader: true 인 사람이 랩장 (검사 스크립트가 한 명만 허용)
const leader = groups
  .flatMap((g) => g.members.map((p) => ({ ...p, group: g.group })))
  .find((p) => p.leader)
</script>

<template>
  <section v-if="leader">
    <h2 id="lab-leader" tabindex="-1">
      Lab Leader
      <a class="header-anchor" href="#lab-leader" aria-label="Lab Leader">&#8203;</a>
    </h2>
    <div class="leader">
      <PersonAvatar :name="leader.name" :photo="leader.photo" crown :size="104" />
      <div class="leader-info">
        <span class="leader-badge">랩장</span>
        <strong>{{ leader.name }}</strong>
        <span class="leader-group">{{ leader.group }}</span>
      </div>
    </div>
  </section>

  <section v-for="g in groups" :key="g.group">
    <h2 :id="g.group" tabindex="-1">
      {{ g.group }}
      <span class="count">{{ g.members.length }}</span>
      <a class="header-anchor" :href="`#${g.group}`" :aria-label="g.group">&#8203;</a>
    </h2>
    <div class="people-grid">
      <div v-for="p in g.members" :key="p.name" class="person" :class="{ 'is-leader': p.leader }">
        <PersonAvatar :name="p.name" :photo="p.photo" :crown="p.leader" />
        <strong>{{ p.name }}</strong>
        <span v-if="p.affiliation" class="affiliation">{{ p.affiliation }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.leader {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 28px;
  padding: 40px 28px 24px;
  border: 1px solid rgba(224, 165, 22, 0.45);
  border-radius: 16px;
  background:
    radial-gradient(circle at 0% 0%, rgba(245, 197, 66, 0.22), transparent 55%),
    var(--vp-c-bg-soft);
}
.leader-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.leader-badge {
  padding: 1px 10px;
  border-radius: 999px;
  background: rgba(224, 165, 22, 0.18);
  color: #9a6a00;
  font-size: 12px;
  font-weight: 700;
}
.dark .leader-badge {
  color: #f5c542;
}
.leader-info strong {
  font-size: 22px;
}
.leader-group {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
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
  padding: 28px 10px 16px;
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
.person.is-leader {
  border-color: rgba(224, 165, 22, 0.55);
}
.person :deep(.person-avatar) {
  margin-bottom: 4px;
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
