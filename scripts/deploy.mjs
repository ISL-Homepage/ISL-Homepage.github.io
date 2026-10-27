// npm run deploy [-- "커밋 메시지"]
// 1) 새 PDF 반영, 데이터 검사, 썸네일, 빌드를 모두 통과해야 다음으로 넘어간다.
// 2) 바뀐 파일을 보여 주고 확인을 받은 뒤 커밋하고 push 한다.
// 3) push 하면 GitHub Actions(.github/workflows/deploy.yml)가 GitHub Pages에 배포한다.
import { execFileSync, spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { root } from './lib.mjs'

const red = (s) => `\x1b[31m${s}\x1b[0m`
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const tryGit = (...args) => {
  try {
    return git(...args)
  } catch {
    return null
  }
}
const stop = (msg) => {
  console.error(`\n${red('✖ 배포 중단')}: ${msg}\n`)
  process.exit(1)
}

// 1. 검사와 빌드
console.log('▶ 데이터 반영, 검사, 빌드')
const build = spawnSync('npm', ['run', 'docs:build'], { cwd: root, stdio: 'inherit', shell: true })
if (build.status !== 0) stop('위 오류를 고친 뒤 다시 실행하세요. 사이트는 바뀌지 않았습니다.')

// 2. 원격 저장소 확인
const remote = tryGit('remote', 'get-url', 'origin')
if (!remote) stop('원격 저장소(origin)가 없습니다. docs/MIGRATION.md 의 1단계를 먼저 진행하세요.')
const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
if (branch !== 'main') stop(`main 브랜치에서만 배포합니다. (지금: ${branch})`)

// 3. 바뀐 파일 커밋
const changes = git('status', '--porcelain')
if (changes) {
  console.log('\n▶ 바뀐 파일')
  console.log(changes.split('\n').map((l) => '  ' + l).join('\n'))
  if (!process.stdin.isTTY) stop('확인 입력을 받을 수 없는 환경입니다. 직접 커밋한 뒤 실행하세요.')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question('\n이 파일들을 커밋하고 배포할까요? (y/N) ')).trim().toLowerCase()
  rl.close()
  if (answer !== 'y') stop('취소했습니다.')
  const message = process.argv.slice(2).join(' ').trim() || `사이트 업데이트 (${new Date().toISOString().slice(0, 10)})`
  git('add', '-A')
  git('commit', '-m', message)
}

// 4. push
tryGit('fetch', 'origin', 'main')
const behind = tryGit('rev-list', '--count', 'HEAD..origin/main')
if (behind && behind !== '0') {
  stop(`원격에 새 커밋이 ${behind}개 있습니다. "git pull --rebase" 후 다시 실행하세요.`)
}
const ahead = tryGit('rev-list', '--count', 'origin/main..HEAD') ?? '1'
if (ahead === '0') {
  console.log('\n✔ 이미 최신입니다. 배포할 변경이 없습니다.\n')
  process.exit(0)
}
console.log('\n▶ push')
const push = spawnSync('git', ['push', 'origin', 'main'], { cwd: root, stdio: 'inherit' })
if (push.status !== 0) stop('push 에 실패했습니다. 위 메시지를 확인하세요.')

const repo = remote.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '')
console.log(`\n✔ push 완료. 몇 분 뒤 사이트에 반영됩니다.`)
console.log(`  배포 진행 상황: ${repo}/actions\n`)
