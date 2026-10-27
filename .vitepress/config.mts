import { defineConfig } from 'vitepress'
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

const lectureFiles = readdirSync('data/lectures').map((f) => `data/lectures/${f}`)

// 데이터 파일로 그리는 페이지는 md 파일보다 데이터 파일이 더 자주 바뀐다.
// 해당 데이터 파일의 마지막 커밋 시각을 "최종 수정"에 함께 반영한다.
const dataDeps: Record<string, string[]> = {
  'seminar/index.md': ['data/seminars.yaml'],
  'people/index.md': ['data/people.yaml'],
  'publication/index.md': ['data/publications.yaml'],
  'lecture/index.md': lectureFiles,
  'lecture/experiments.md': lectureFiles,
  'lecture/programming.md': lectureFiles
}

function gitTimestamp(file: string): number {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%at', '--', file], {
      encoding: 'utf8'
    }).trim()
    return out ? Number(out) * 1000 : 0
  } catch {
    return 0
  }
}

export default defineConfig({
  lang: 'ko-KR',
  title: 'ISL',
  description: 'Image System Laboratory, Chungnam National University',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'docs/**', 'tools/**'],
  // .hwp 등 첨부파일을 페이지 링크로 오인하므로 첨부 경로는 검사에서 제외
  ignoreDeadLinks: [/^\/attachments\//],
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  transformPageData(pageData) {
    const deps = dataDeps[pageData.relativePath]
    if (!deps) return
    const latest = Math.max(pageData.lastUpdated ?? 0, ...deps.map(gitTimestamp))
    if (latest > 0) pageData.lastUpdated = latest
  },

  themeConfig: {
    logo: '/images/Res_ISL_Logo.png',
    siteTitle: 'Image System Lab',

    nav: [
      { text: 'About', link: '/about/' },
      { text: 'People', link: '/people/' },
      { text: 'Publication', link: '/publication/' },
      {
        text: 'Research',
        items: [
          { text: 'Interests', link: '/research/interests' },
          { text: 'Project', link: '/research/project' }
        ]
      },
      {
        text: 'Lecture',
        items: [
          { text: '전체', link: '/lecture/' },
          { text: '전자회로실험', link: '/lecture/experiments' },
          { text: '프로그래밍응용', link: '/lecture/programming' }
        ]
      },
      {
        text: 'Seminar',
        items: [
          { text: 'Seminar', link: '/seminar/' },
          { text: 'Demo Video', link: '/seminar/demo' }
        ]
      }
    ],

    outline: { level: [2, 3], label: '목차' },
    lastUpdated: {
      text: '최종 수정',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
    },
    docFooter: { prev: '이전', next: '다음' },
    darkModeSwitchLabel: '테마',
    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '메뉴',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '검색', buttonAriaLabel: '검색' },
          modal: {
            noResultsText: '결과 없음',
            resetButtonTitle: '지우기',
            footer: { selectText: '선택', navigateText: '이동', closeText: '닫기' }
          }
        }
      }
    },

    footer: {
      message:
        '<a href="https://plus.cnu.ac.kr/html/kr/">충남대학교</a> · ' +
        '<a href="https://mec.cnu.ac.kr/">메카트로닉스공학과</a> · ' +
        '<a href="https://www.facebook.com/mechacnu">메카 총동문회</a>',
      copyright: '© Image System Laboratory, Chungnam National University'
    }
  }
})
