---
aside: false
---

# People

## Professor

<div class="prof">
  <img class="prof-photo" src="/images/people/professor.png" alt="고윤호 교수">
  <div class="prof-info">
    <p class="prof-name">고윤호 <span>Prof. Yun-Ho Ko</span></p>
    <p class="prof-role">충남대학교 메카트로닉스공학과 교수</p>
    <ul class="prof-contact">
      <li><span>Office</span>충남대학교 공대 4호관 527호</li>
      <li><span>Tel</span>+82-42-821-6860</li>
      <li><span>E-mail</span><a href="mailto:koyh@cnu.ac.kr">koyh@cnu.ac.kr</a></li>
    </ul>
  </div>
</div>

<div class="prof-detail">
  <section>
    <h3>Education</h3>
    <ul class="timeline">
      <li><b>Ph.D.</b> Electrical Engineering &amp; Computer Science, KAIST<em>2002</em></li>
      <li><b>M.S.</b> Electrical Engineering &amp; Computer Science, KAIST<em>1997</em></li>
      <li><b>B.S.</b> Electrical Engineering, Pusan National University<em>1995</em></li>
    </ul>
  </section>
  <section>
    <h3>Experience</h3>
    <ul class="timeline">
      <li><b>Senior Engineer</b> MCU Application Design Team, Hynix Semiconductor Inc.<em>2002.9 ~ 2004.9</em></li>
    </ul>
  </section>
  <section>
    <h3>Research Interest</h3>
    <div class="prof-tags">
      <span>Computer vision</span>
      <span>Image compression</span>
      <span>Pattern recognition</span>
      <span>Augmented Reality</span>
      <span>Watermarking</span>
    </div>
  </section>
</div>

<!-- 아래 명단은 data/people.yaml 에서 관리합니다. -->
<PeopleGrid />

<style>
.prof {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  margin-top: 16px;
  padding: 24px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 100% 0%, rgba(240, 163, 94, 0.2), transparent 55%),
    var(--vp-c-bg-soft);
}
.prof-photo {
  width: 140px;
  height: 170px;
  object-fit: cover;
  object-position: top;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.prof-info {
  flex: 1 1 260px;
}
.vp-doc .prof-info p {
  margin: 0;
}
.prof-name {
  font-size: 24px;
  font-weight: 700;
}
.prof-name span {
  margin-left: 6px;
  color: var(--vp-c-text-2);
  font-size: 16px;
  font-weight: 500;
}
.prof-role {
  margin-top: 2px;
  color: var(--vp-c-text-2);
  font-size: 15px;
}
.vp-doc .prof-contact {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}
.vp-doc .prof-contact li {
  margin: 4px 0;
  font-size: 14px;
}
.prof-contact li span {
  display: inline-block;
  width: 56px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
.prof-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.prof-detail section {
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}
.vp-doc .prof-detail h3 {
  margin: 0 0 10px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.vp-doc .timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}
.vp-doc .timeline li {
  position: relative;
  margin: 0 0 10px;
  padding-left: 16px;
  font-size: 14px;
  line-height: 1.5;
}
.timeline li::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}
.timeline b {
  display: block;
}
.timeline em {
  display: block;
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-style: normal;
}
.prof-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.prof-tags span {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 500;
}
</style>
