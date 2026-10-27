// public/attachments/seminar/ 에 새로 넣은 PDF를 data/seminars.yaml 에 자동으로 추가한다.
// 파일 이름 형식: YYYYMMDD_발표자_제목.pdf (예: 20260301_홍길동_Visual SLAM 소개.pdf)
// 이미 yaml에 있는 PDF는 건드리지 않는다. 형식에 맞지 않는 파일은 오류로 알려 준다.
import { appendFileSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parse } from 'yaml'
import { fail, paths, report } from './lib.mjs'

const NAME_RE = /^(?:-Unlicensed-)?(\d{4})(\d{2})(\d{2})_([^_]+)_(.+)$/

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const yamlText = readFileSync(paths.seminars, 'utf8')
let list
try {
  list = parse(yamlText) ?? []
} catch (e) {
  // 문법 오류는 check-data 에서 줄 번호와 함께 알려 주므로 여기서는 건너뛴다
  process.exit(0)
}
const known = new Set(list.map((s) => s?.file).filter(Boolean))

const errors = []
const added = []
for (const abs of walk(paths.seminarPdfs)) {
  const file = relative(paths.seminarPdfs, abs).replace(/\\/g, '/')
  if (!file.toLowerCase().endsWith('.pdf')) {
    errors.push(`${file}: PDF가 아닌 파일입니다. 지우거나 다른 폴더로 옮기세요.`)
    continue
  }
  if (known.has(file)) continue

  const base = file.split('/').pop().replace(/\.pdf$/i, '')
  const m = base.match(NAME_RE)
  if (!m) {
    errors.push(
      `${file}: data/seminars.yaml 에 없는 PDF인데, 파일 이름이 "YYYYMMDD_발표자_제목.pdf" 형식이 아닙니다.\n` +
        `      파일 이름을 바꾸거나 data/seminars.yaml 에 직접 항목을 추가하세요.`
    )
    continue
  }
  const [, y, mo, d, speaker, title] = m
  const folder = file.split('/')[0]
  if (folder !== y) {
    errors.push(`${file}: 날짜는 ${y}년인데 ${folder}/ 폴더에 있습니다. ${y}/ 폴더로 옮기세요.`)
    continue
  }
  added.push({ date: `${y}-${mo}-${d}`, title: title.replace(/_/g, ' ').trim(), speaker, file })
}

if (errors.length) fail('세미나 PDF', errors)

if (added.length) {
  const q = (v) => JSON.stringify(v)
  const text = added
    .map((s) => `- date: ${s.date}\n  title: ${q(s.title)}\n  speaker: ${q(s.speaker)}\n  file: ${q(s.file)}\n`)
    .join('')
  appendFileSync(paths.seminars, (yamlText.endsWith('\n') ? '' : '\n') + text)
  report(
    '세미나',
    added.map((s) => `추가됨: ${s.date} ${s.title} (${s.speaker})`),
    '설명(desc)을 붙이거나 제목을 고치려면 data/seminars.yaml 맨 아래 항목을 수정하세요.'
  )
}
