---
# 홈 화면은 이 파일의 front matter만 고치면 됩니다.
# - hero: 상단 큰 제목/문구/버튼/이미지
# - showcase: hero 오른쪽에서 차례로 바뀌는 연구 이미지(GIF 가능). 순서대로 표시
#   showcaseInterval: 기본으로 머무는 시간(초). 슬라이드마다 duration 으로 따로 정할 수 있음
# - features: 아래 카드(타일). title/details/link/icon 수정
# 이미지는 public/images/ 에 넣고 /images/파일명 으로 적습니다.
layout: home
# 브라우저 탭 제목: "Welcome to ISL • Image System Laboratory"
title: Welcome to ISL
titleTemplate: ':title • Image System Laboratory'

hero:
  name: Image System Laboratory
  text: 영상 시스템 연구실
  tagline: 충남대학교 메카트로닉스공학과에서 영상 처리와 컴퓨터 비전, 딥러닝을 연구합니다
  actions:
    - theme: brand
      text: 연구실 소개
      link: /about/
    - theme: alt
      text: 논문 보기
      link: /publication/

showcaseInterval: 5
showcase:
  - src: /images/showcase_slam.gif
    caption: Visual SLAM (RAF Set SLAM)
    link: /research/interests
    duration: 8
  - src: /images/showcase_gan.gif
    caption: GAN 기반 얼굴 영상 생성
    link: /research/interests
    duration: 7.7
  - src: /images/FRUC01.png
    caption: Frame Rate Up Conversion
    link: /research/interests
  - src: /images/DEHAZING02.png
    caption: HLS 기반 안개 제거
    link: /research/interests
  - src: /images/3D03.png
    caption: Active Stereo 3D 복원
    link: /research/interests

features:
  - icon:
      src: /images/전자회로실험교재.jpg
    title: 전자회로실험
    details: 강의 계획서, 주차별 실험 공지, 보고서 양식
    link: /lecture/experiments
  - icon:
      src: /images/home/research.jpg
    title: Research Interests
    details: FRUC, SLAM, GAN, De-Hazing, Retinex, 3D Reconstruction
    link: /research/interests
  - icon:
      src: /images/home/seminar.jpg
    title: Seminar
    details: 2014년부터 이어진 연구실 세미나 발표 자료
    link: /seminar/
---
