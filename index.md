---
# 홈 화면은 이 파일의 front matter만 고치면 됩니다.
# - hero: 상단 큰 제목/문구/버튼/이미지
# - showcase: hero 오른쪽에서 차례로 바뀌는 연구 이미지(GIF 가능). 순서대로 표시
#   showcaseInterval: 바뀌는 간격(초)
# - features: 아래 카드(타일). title/details/link/icon 수정
# 이미지는 public/images/ 에 넣고 /images/파일명 으로 적습니다.
layout: home

hero:
  name: Image System Laboratory
  text: 영상 시스템 연구실
  tagline: 충남대학교 메카트로닉스공학과에서 영상 처리와 컴퓨터 비전, 딥러닝을 연구합니다
  actions:
    - theme: brand
      text: 연구실 소개
      link: /about/
    - theme: alt
      text: 전자회로실험 공지
      link: /lecture/experiments

showcaseInterval: 5
showcase:
  - src: /images/isl_main3.gif
    caption: Visual SLAM (RAF Set SLAM)
    link: /research/interests
  - src: /images/FRUC01.png
    caption: Frame Rate Up Conversion
    link: /research/interests
  - src: /images/DEHAZING02.png
    caption: HLS 기반 안개 제거
    link: /research/interests
  - src: /images/3D03.png
    caption: Active Stereo 3D 복원
    link: /research/interests
  - src: /images/SLAM02.png
    caption: RAFSet SLAM 결과
    link: /research/interests

features:
  - icon:
      src: /images/전자회로실험교재.jpg
    title: 전자회로실험
    details: 강의 계획서, 주차별 실험 공지, 보고서 양식
    link: /lecture/experiments
  - icon:
      src: /images/interests.jpg
    title: Research Interests
    details: FRUC, SLAM, GAN, De-Hazing, Retinex, 3D Reconstruction
    link: /research/interests
  - icon:
      src: /images/project.jpg
    title: Project
    details: 진행 중인 과제와 수행했던 과제, 저서
    link: /research/project
  - icon:
      src: /images/Res_seminar.jpg
    title: Seminar
    details: 2014년부터 이어진 연구실 세미나 발표 자료
    link: /seminar/
  - icon:
      src: /images/Res_demo.jpg
    title: Demo Video
    details: SLAM, 캡스톤 디자인 시연 영상
    link: /seminar/demo
  - icon:
      src: /images/People.jpg
    title: People
    details: 교수님, 박사·석사 과정, 학부생, 졸업생
    link: /people/
---
