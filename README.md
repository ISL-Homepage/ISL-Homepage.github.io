# ISL 홈페이지

충남대학교 영상 시스템 연구실(Image System Laboratory) 홈페이지입니다.
[VitePress](https://vitepress.dev)로 만들었고, `main` 브랜치에 push 하면 GitHub Pages에 자동 배포됩니다.

## 자주 하는 일

| 하고 싶은 일 | 고칠 곳 |
|---|---|
| 실험 공지 올리기 | PDF를 `public/attachments/<폴더>/`에 넣고 `lecture/experiments.md`에 링크 한 줄 추가 |
| 세미나 자료 올리기 | PDF를 `public/attachments/seminar/<연도>/`에 넣고 `data/seminars.yaml`에 항목 하나 추가 |
| 사람 추가·졸업 처리 | `data/people.yaml` (사진은 `public/images/`) |
| 홈 상단 문구·버튼·카드 | `index.md` 맨 위 front matter의 `hero`, `features` |
| 상단 메뉴 | `.vitepress/config.mts`의 `nav` |

- 글의 "최종 수정" 날짜는 git 커밋 시각으로 자동 표시됩니다. 날짜를 직접 적을 필요가 없습니다.
- 링크는 사이트 기준 절대 경로로 씁니다. 예: `[다운로드](/attachments/2025_notice/2주차.pdf)`
  파일 이름에 공백이 있으면 `[다운로드](</attachments/2025_notice/2주차 실험 공지.pdf>)`처럼 `< >`로 감쌉니다.
- 파일 이름에 `#`은 쓰지 않습니다.

GitHub 웹에서 파일을 고치고 commit 해도 됩니다. 몇 분 뒤 Actions 탭에서 배포가 끝나면 반영됩니다.

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
index.md                 홈 (hero, 카드)
about/ people/ publication/ research/ lecture/ seminar/   각 메뉴 페이지
data/                    세미나·사람 데이터(yaml)와 로더
public/images/           이미지
public/attachments/      강의 첨부, 세미나 PDF
.vitepress/config.mts    사이트 설정, 메뉴
.vitepress/theme/        테마 확장, 컴포넌트(SeminarList, PeopleGrid), 색상
docs/MIGRATION.md        옛 사이트(isl-homepage.github.io)에서 옮기는 절차
tools/redirect-stub/     옛 저장소에 넣을 리디렉션 파일
```

세미나 PDF 중 2014~2019년 자료는 옛 저장소에서 2020년 5월에 사라졌던 것을 git 기록(`00516ee`)에서 복구한 것입니다.
