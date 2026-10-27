# ISL 홈페이지

충남대학교 영상 시스템 연구실(Image System Laboratory) 홈페이지입니다.
[VitePress](https://vitepress.dev)로 만들었고, `main` 브랜치에 push 하면 GitHub Pages에 자동 배포됩니다.

GitHub 웹에서 파일을 고치고 commit 해도 됩니다. 몇 분 뒤 Actions 탭에서 배포가 끝나면 반영됩니다.

## 자주 하는 일

| 하고 싶은 일 | 고칠 곳 |
|---|---|
| 실험 공지 올리기 | PDF를 `public/attachments/<폴더>/`에 넣고 `lecture/experiments.md`에 링크 한 줄 추가 |
| 세미나 자료 올리기 | PDF를 `public/attachments/seminar/<연도>/`에 넣고 `data/seminars.yaml`에 항목 하나 추가 |
| 논문 추가 | `data/publications.yaml`에 항목 하나 추가 |
| 사람 추가, 졸업 처리 | `data/people.yaml` (사진은 `public/images/`) |
| 홈 화면 문구, 이미지, 카드 | `index.md` 맨 위 front matter ([아래 설명](#홈-화면-바꾸기)) |
| 상단 메뉴 | `.vitepress/config.mts`의 `nav` |

- 글의 "최종 수정" 날짜는 git 커밋 시각으로 자동 표시됩니다. 날짜를 직접 적을 필요가 없습니다.
- 링크는 사이트 기준 절대 경로로 씁니다. 예: `[다운로드](/attachments/2025_notice/2주차.pdf)`
  파일 이름에 공백이 있으면 `[다운로드](</attachments/2025_notice/2주차 실험 공지.pdf>)`처럼 `< >`로 감쌉니다.
- 파일 이름에 `#`은 쓰지 않습니다.

## 홈 화면 바꾸기

홈 화면은 `index.md` 맨 위 `---` 사이(front matter)만 고치면 됩니다. 들여쓰기는 스페이스 두 칸입니다.

### 제목, 소개 문구, 버튼 (`hero`)

```yaml
hero:
  name: Image System Laboratory          # 큰 제목(빨간 글씨)
  text: 영상 시스템 연구실                # 그 아래 큰 글씨
  tagline: 충남대학교 메카트로닉스공학과에서 ...   # 소개 문구
  actions:                               # 버튼. 순서대로 표시
    - theme: brand                       # brand = 빨간 버튼, alt = 회색 버튼
      text: 연구실 소개
      link: /about/
```

### 오른쪽 연구 이미지 슬라이드 (`showcase`)

제목 오른쪽(모바일에서는 제목 위) 카드에서 이미지가 차례로 바뀝니다. 마우스를 올리면 멈추고, 아래 점을 누르면 해당 이미지로 넘어갑니다.

```yaml
showcaseInterval: 5                      # 한 장이 머무는 기본 시간(초)
showcase:
  - src: /images/showcase_slam.gif       # 이미지 경로 (public/images/ 안의 파일)
    caption: Visual SLAM (RAF Set SLAM)  # 카드 아래 이름
    link: /research/interests            # 누르면 이동할 곳 (선택)
    duration: 8                          # 이 장만 머무는 시간(초, 선택)
  - src: /images/FRUC01.png
    caption: Frame Rate Up Conversion
```

- **추가**: 이미지를 `public/images/`에 넣고 목록에 `- src: ...` 항목을 하나 더 적습니다.
- **빼기, 순서 바꾸기**: 항목을 지우거나 위아래로 옮깁니다. 첫 항목이 처음에 보입니다.
- **GIF**: 그대로 쓸 수 있습니다. 이미지가 바뀔 때마다 GIF는 처음부터 재생되므로, `duration`을 GIF 한 바퀴 길이에 맞추면 끝까지 보입니다.
  지금 쓰는 `showcase_slam.gif`는 8초, `showcase_gan.gif`는 7.7초입니다.
- **이미지 비율**: 가로가 세로의 약 2.3배인 이미지가 카드에 꽉 찹니다. 비율이 다르면 잘리지 않고 여백이 생깁니다.
- `showcase`를 통째로 지우면 오른쪽 카드가 사라집니다.

### 아래 카드 (`features`)

```yaml
features:
  - icon:
      src: /images/Res_seminar.jpg       # 카드 위 사진
    title: Seminar
    details: 2014년부터 이어진 연구실 세미나 발표 자료
    link: /seminar/
```

## 세미나 자료 올리기

1. PDF를 `public/attachments/seminar/<연도>/`에 넣습니다. 파일 이름 예: `20260301_홍길동_발표제목.pdf`
2. `data/seminars.yaml`에 항목을 추가합니다. 순서는 상관없습니다(날짜순 자동 정렬).
   ```yaml
   - date: 2026-03-01
     title: "발표 제목"
     speaker: "홍길동"
     desc: "한 줄 설명 (선택)"
     file: "2026/20260301_홍길동_발표제목.pdf"
   ```

세미나 카드의 미리보기 이미지(PDF 첫 페이지)는 빌드할 때 자동으로 만들어집니다(`scripts/seminar-thumbs.mjs`). 따로 만들 필요가 없습니다.

## 논문 추가

`data/publications.yaml`에 항목을 추가합니다. 저널/학회, 국제/국내 구분과 연도별 정렬은 자동입니다.

```yaml
- type: journal              # journal 또는 conference
  scope: international       # international 또는 domestic
  year: 2026
  authors: "Gil-Dong Hong, Yun-Ho Ko"
  title: "논문 제목"
  venue: "학술지 또는 학회 이름, Vol., pp., 날짜"
```

## 로컬에서 보기

Node.js 20 이상이 필요합니다.

```bash
npm ci
npm run docs:dev      # http://localhost:5173 (저장하면 바로 반영)
npm run docs:build    # 배포용 빌드 (.vitepress/dist)
npm run docs:preview  # 빌드 결과 확인
```

## 구조

```
index.md                 홈 (hero, 연구 이미지 슬라이드, 카드)
about/ people/ publication/ research/ lecture/ seminar/   각 메뉴 페이지
data/                    세미나, 논문, 사람 데이터(yaml)와 로더
public/images/           이미지
public/attachments/      강의 첨부, 세미나 PDF
scripts/                 빌드 보조 스크립트 (세미나 썸네일 생성)
.vitepress/config.mts    사이트 설정, 메뉴
.vitepress/theme/        테마 확장, 컴포넌트, 색상
docs/MIGRATION.md        옛 사이트(isl-homepage.github.io)에서 옮기는 절차
tools/redirect-stub/     옛 저장소에 넣을 리디렉션 파일
```

세미나 PDF 중 2014~2019년 자료는 옛 저장소에서 2020년 5월에 사라졌던 것을 git 기록(`00516ee`)에서 복구한 것입니다.
