---
aside: false
---

# About

<div class="about-lead">
  <p class="kicker">Image System Laboratory</p>
  <p class="headline">각종 영상 처리 및 인식 기술에 대한 연구를 합니다.</p>
  <p>
    영상 처리 및 인식에 필요한 요소 알고리즘을 개발, 검증하고 이를 시스템으로 구현하는 것을 목표로 합니다.
    영상을 분석하고 해석하는 영상 처리 및 인식 기술과 함께, 임베디드 시스템 구현 기술,
    영상 전송을 위한 압축 기술(H.264, SVC), 영상 감시 시스템의 인증을 위한 워터마킹 기술을 연구합니다.
  </p>
</div>

## 응용 분야

<div class="about-areas">
  <div><strong>영상 감시</strong><span>산업, 국방용 영상 감시 시스템</span></div>
  <div><strong>공장 자동화</strong><span>비전 기반 검사와 측정</span></div>
  <div><strong>다차원 영상 검사</strong><span>3차원 형상 측정, 검사 장비</span></div>
  <div><strong>의료 영상</strong><span>의료 영상 분석 시스템</span></div>
  <div><strong>로봇 비전</strong><span>SLAM, 위치 추정, 인간형 로봇 비전</span></div>
  <div><strong>증강 현실</strong><span>실시간 영상 정합과 추적</span></div>
</div>

## 핵심 기술

<div class="about-tags">
  <span>영상 처리 및 인식</span>
  <span>컴퓨터 비전</span>
  <span>딥러닝</span>
  <span>Visual SLAM</span>
  <span>스테레오 비전, 3D 복원</span>
  <span>영상 화질 개선</span>
  <span>영상 압축 (H.264, SVC)</span>
  <span>워터마킹</span>
  <span>임베디드 시스템 구현</span>
</div>

자세한 연구 내용은 [Research Interests](/research/interests)와 [Project](/research/project)에서 볼 수 있습니다.

## 연구 장비

<!-- 장비 목록은 data/equipment.yaml 에서 관리합니다. -->
<EquipmentGrid />

<style>
.about-lead {
  margin-top: 8px;
  padding: 28px 28px 20px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 100% 0%, rgba(240, 163, 94, 0.22), transparent 55%),
    radial-gradient(circle at 0% 100%, rgba(201, 37, 44, 0.12), transparent 60%),
    var(--vp-c-bg-soft);
}
.about-lead .kicker {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.about-lead .headline {
  margin: 6px 0 12px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
}
.about-lead p:last-child {
  color: var(--vp-c-text-2);
}
.about-areas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.about-areas div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 10px;
}
.about-areas span {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.about-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.about-tags span {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 500;
}
</style>
