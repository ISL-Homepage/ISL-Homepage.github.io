// 사이트 배포. 저장소 구조: 소스는 source 브랜치, GitHub Pages가 보여 주는 결과물은 master 브랜치.
//
//   npm run deploy                 정식 배포: 소스를 커밋해 source에 push 하고, 빌드 결과로 master 전체를 바꾼다
//   npm run deploy -- "메시지"      커밋 메시지 지정
//   npm run deploy:preview         미리보기: /temp/ 경로로 빌드해 master의 temp/ 폴더만 바꾼다 (지금 사이트는 그대로)
//   (공통) --no-push               push 하지 않고 master 커밋까지만 만든다
//
// 검사나 빌드가 하나라도 실패하면 아무것도 올리지 않는다.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { root } from './lib.mjs'

const args = process.argv.slice(2)
const preview = args.includes('--preview')
const noPush = args.includes('--no-push')
const message = args.filter((a) => !a.startsWith('--')).join(' ').trim()

const SOURCE = 'source'
const PAGES = 'master'
const BASE = preview ? '/temp/' : '/'
const outDir = join(root, '.vitepress', preview ? 'dist-temp' : 'dist')
const deployDir = join(root, '.vitepress', '.deploy')

// 옛 Jekyll 사이트에서 이름이 바뀐 주소 → 새 주소. 정식 배포 때 옛 주소에 이동용 페이지를 만든다.
// (같은 이름의 .html이 있는 경로는 넣지 않는다. /research/interests/ 처럼 끝에 / 만 붙은 옛 주소는 404.html이 / 를 떼고 보낸다)
const OLD_PATHS = {
  'seminar/seminar': '/seminar/',
  'lecture_spring/experiments': '/lecture/experiments',
  'lecture_fall/programming': '/lecture/programming'
}
const TRAILING_SLASH_FIX =
  '<script>(function(){var p=location.pathname;' +
  "if(p.length>1&&p.slice(-1)==='/')location.replace(p.slice(0,-1)+location.search+location.hash)})()</script>"

const red = (s) => `\x1b[31m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8' }).trim()
const tryGit = (cwd, ...a) => {
  try {
    return git(cwd, ...a)
  } catch {
    return null
  }
}
const stop = (msg) => {
  console.error(`\n${red('✖ 배포 중단')}: ${msg}\n`)
  cleanup()
  process.exit(1)
}
function cleanup() {
  if (existsSync(deployDir)) tryGit(root, 'worktree', 'remove', '--force', deployDir)
  rmSync(deployDir, { recursive: true, force: true })
  tryGit(root, 'worktree', 'prune')
}
async function confirm(question) {
  if (!process.stdin.isTTY) stop('확인 입력을 받을 수 없는 환경입니다. 터미널에서 직접 실행하세요.')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question(`\n${question} (y/N) `)).trim().toLowerCase()
  rl.close()
  return answer === 'y'
}

// 0. 원격 저장소
const remote = tryGit(root, 'remote', 'get-url', 'origin')
if (!remote) stop('원격 저장소(origin)가 없습니다. README의 "처음 시작하기"를 확인하세요.')
const branch = git(root, 'rev-parse', '--abbrev-ref', 'HEAD')

// 1. 정식 배포는 소스부터 커밋하고 push 한다 (미리보기는 소스를 건드리지 않음)
if (!preview) {
  if (branch !== SOURCE) stop(`${SOURCE} 브랜치에서만 정식 배포합니다. (지금: ${branch})`)
  tryGit(root, 'fetch', 'origin', SOURCE)
  const behind = tryGit(root, 'rev-list', '--count', `HEAD..origin/${SOURCE}`)
  if (behind && behind !== '0') stop(`원격에 새 커밋이 ${behind}개 있습니다. "git pull --rebase" 후 다시 실행하세요.`)
}

// 2. 검사와 빌드
console.log(`▶ 데이터 반영, 검사, 빌드 (경로: ${BASE})`)
const data = spawnSync('npm', ['run', 'data'], { cwd: root, stdio: 'inherit', shell: true })
if (data.status !== 0) stop('위 오류를 고친 뒤 다시 실행하세요. 사이트는 바뀌지 않았습니다.')
const vp = spawnSync('npx', ['vitepress', 'build', '--outDir', outDir], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SITE_BASE: BASE }
})
rmSync(join(root, '.vitepress', '.temp'), { recursive: true, force: true })
if (vp.status !== 0) stop('빌드에 실패했습니다. 위 오류를 확인하세요. 사이트는 바뀌지 않았습니다.')

if (!preview) {
  const changes = git(root, 'status', '--porcelain')
  if (changes) {
    console.log('\n▶ 바뀐 소스 파일')
    console.log(changes.split('\n').map((l) => '  ' + l).join('\n'))
    if (!(await confirm('이 파일들을 커밋할까요?'))) stop('취소했습니다.')
    git(root, 'add', '-A')
    git(root, 'commit', '-m', message || `사이트 업데이트 (${new Date().toISOString().slice(0, 10)})`)
  }
}
const sourceRev = git(root, 'rev-parse', '--short', 'HEAD')

// 3. master 를 별도 폴더(worktree)로 꺼내 결과물을 넣는다
console.log(`\n▶ ${PAGES} 브랜치 준비`)
cleanup()
if (tryGit(root, 'fetch', '--depth=1', 'origin', PAGES) === null) stop(`원격의 ${PAGES} 브랜치를 가져오지 못했습니다.`)
git(root, 'worktree', 'add', '--detach', deployDir, 'FETCH_HEAD')

if (preview) {
  rmSync(join(deployDir, 'temp'), { recursive: true, force: true })
  cpSync(outDir, join(deployDir, 'temp'), { recursive: true })
} else {
  for (const f of readdirSync(deployDir)) if (f !== '.git') rmSync(join(deployDir, f), { recursive: true, force: true })
  cpSync(outDir, deployDir, { recursive: true })
  writeFileSync(join(deployDir, '.nojekyll'), '') // Jekyll 처리 끄기 (VitePress 결과물을 그대로 보여 줌)
  const notFound = join(deployDir, '404.html')
  writeFileSync(notFound, readFileSync(notFound, 'utf8').replace('<head>', `<head>${TRAILING_SLASH_FIX}`))
  for (const [from, to] of Object.entries(OLD_PATHS)) {
    const dir = join(deployDir, from)
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'index.html'),
      `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${to}">` +
        `<link rel="canonical" href="${to}"><script>location.replace(${JSON.stringify(to)} + location.hash)</script>` +
        `<a href="${to}">이동</a>\n`
    )
  }
}

git(deployDir, '-c', 'core.autocrlf=false', '-c', 'core.safecrlf=false', 'add', '-A')
const stat = git(deployDir, 'diff', '--cached', '--shortstat')
if (!stat) {
  console.log(`\n${green('✔ 이미 최신입니다.')} 올릴 변경이 없습니다.\n`)
  cleanup()
  process.exit(0)
}
git(deployDir, 'commit', '-m', preview ? `미리보기(/temp) 배포: source ${sourceRev}` : `사이트 배포: source ${sourceRev}`)
console.log(`\n▶ ${PAGES}에 올릴 변경: ${stat}`)

// 4. push
if (noPush) {
  console.log(`\n${green('✔ 준비 완료')} (--no-push). push 하지 않았습니다.`)
  console.log(`  확인: git -C "${deployDir}" show --stat HEAD`)
  console.log(`  올리기: git -C "${deployDir}" push origin HEAD:${PAGES}\n`)
  process.exit(0)
}
const where = preview ? 'temp/ 미리보기' : '사이트 전체'
if (!(await confirm(`${where}를 지금 올릴까요? (공개 사이트에 바로 반영됩니다)`))) stop('취소했습니다.')
if (!preview) {
  const s = spawnSync('git', ['push', 'origin', SOURCE], { cwd: root, stdio: 'inherit' })
  if (s.status !== 0) stop('source 브랜치 push 에 실패했습니다.')
}
const p = spawnSync('git', ['push', 'origin', `HEAD:${PAGES}`], { cwd: deployDir, stdio: 'inherit' })
if (p.status !== 0) stop(`${PAGES} push 에 실패했습니다. 위 메시지를 확인하세요.`)
cleanup()

const site = remote
  .replace(/^git@github\.com:([^/]+)\/.*$/, 'https://$1.github.io')
  .replace(/^https:\/\/github\.com\/([^/]+)\/.*$/, 'https://$1.github.io')
  .toLowerCase()
console.log(`\n${green('✔ push 완료.')} 1~2분 뒤 반영됩니다: ${site}${BASE}\n`)
