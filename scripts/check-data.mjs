// data/*.yaml 을 검사한다. 문제가 있으면 파일, 줄 번호, 고칠 내용을 보여 주고 빌드를 멈춘다.
import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { LineCounter, parseDocument } from 'yaml'
import { fail, paths, root } from './lib.mjs'

const errors = []

/** yaml을 읽어 [항목, 줄 번호] 목록을 돌려준다. 문법 오류도 줄 번호로 기록한다. */
function load(file) {
  const name = relative(root, file).replace(/\\/g, '/')
  const lc = new LineCounter()
  const doc = parseDocument(readFileSync(file, 'utf8'), { lineCounter: lc })
  if (doc.errors.length) {
    for (const e of doc.errors) {
      const { line } = lc.linePos(e.pos[0])
      errors.push(`${name} ${line}번째 줄: yaml 형식 오류 (들여쓰기, 따옴표, 콜론 뒤 공백을 확인하세요)`)
    }
    return { name, items: [] }
  }
  const seq = doc.contents
  if (!seq || !Array.isArray(seq.items)) {
    errors.push(`${name}: "- " 로 시작하는 항목 목록이어야 합니다.`)
    return { name, items: [] }
  }
  const items = seq.items.map((node) => [node.toJSON(), lc.linePos(node.range[0]).line])
  return { name, items }
}

const isDate = (v) => {
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(s + 'T00:00:00Z')
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}
const blank = (v) => v == null || String(v).trim() === ''
const unknownKeys = (obj, allowed) => Object.keys(obj).filter((k) => !allowed.includes(k))

// 세미나
{
  const { name, items } = load(paths.seminars)
  const seen = new Map()
  const KEYS = ['date', 'title', 'speaker', 'desc', 'file']
  for (const [s, line] of items) {
    const at = `${name} ${line}번째 줄`
    if (!s || typeof s !== 'object') {
      errors.push(`${at}: 항목 형식이 잘못되었습니다.`)
      continue
    }
    if (!isDate(s.date)) errors.push(`${at}: date는 2026-03-01 형식이어야 합니다. (지금: ${s.date ?? '없음'})`)
    if (blank(s.title)) errors.push(`${at}: title(제목)이 비어 있습니다.`)
    if (blank(s.speaker)) errors.push(`${at}: speaker(발표자)가 비어 있습니다.`)
    for (const k of unknownKeys(s, KEYS)) errors.push(`${at}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: ${KEYS.join(', ')})`)
    if (s.file) {
      if (!existsSync(join(paths.seminarPdfs, s.file))) {
        errors.push(`${at}: PDF가 없습니다: public/attachments/seminar/${s.file}`)
      }
      if (s.file.includes('#')) errors.push(`${at}: 파일 이름에 #을 쓸 수 없습니다.`)
      if (seen.has(s.file)) errors.push(`${at}: ${seen.get(s.file)}번째 줄과 같은 PDF를 가리킵니다.`)
      seen.set(s.file, line)
    }
  }
}

// 논문
{
  const { name, items } = load(paths.publications)
  const TYPES = ['journal', 'conference']
  const SCOPES = ['international', 'domestic']
  const KEYS = ['type', 'scope', 'year', 'authors', 'title', 'venue', 'text']
  const maxYear = new Date().getFullYear() + 1
  for (const [p, line] of items) {
    const at = `${name} ${line}번째 줄`
    if (!p || typeof p !== 'object') {
      errors.push(`${at}: 항목 형식이 잘못되었습니다.`)
      continue
    }
    if (!TYPES.includes(p.type)) errors.push(`${at}: type은 journal 또는 conference 입니다. (지금: ${p.type ?? '없음'})`)
    if (!SCOPES.includes(p.scope)) errors.push(`${at}: scope는 international 또는 domestic 입니다. (지금: ${p.scope ?? '없음'})`)
    if (!Number.isInteger(p.year) || p.year < 1990 || p.year > maxYear) {
      errors.push(`${at}: year는 2026 처럼 숫자로 적습니다. (지금: ${p.year ?? '없음'})`)
    }
    if (blank(p.title) && blank(p.text)) errors.push(`${at}: title(제목)이 비어 있습니다.`)
    for (const k of unknownKeys(p, KEYS)) errors.push(`${at}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: ${KEYS.join(', ')})`)
  }
}

// 사람
{
  const { name, items } = load(paths.people)
  const leaders = []
  for (const [g, line] of items) {
    const at = `${name} ${line}번째 줄`
    if (blank(g?.group)) errors.push(`${at}: group(구분 이름)이 비어 있습니다.`)
    if (!Array.isArray(g?.members)) {
      errors.push(`${at}: members 목록이 없습니다.`)
      continue
    }
    for (const m of g.members) {
      if (m?.leader !== undefined && typeof m.leader !== 'boolean') {
        errors.push(`${at} (${g.group}, ${m.name}): leader는 true 로만 적습니다. (지금: ${m.leader})`)
      }
      if (m?.leader === true) leaders.push(`${m.name}(${g.group})`)
      if (blank(m?.name)) errors.push(`${at} (${g.group}): name(이름)이 비어 있는 사람이 있습니다.`)
      if (m?.photo && !existsSync(join(paths.peopleImages, m.photo))) {
        errors.push(`${at} (${g.group}, ${m.name}): 사진이 없습니다: public/images/people/${m.photo}`)
      }
    }
  }
  if (leaders.length > 1) {
    errors.push(`${name}: 랩장(leader: true)은 한 명만 둘 수 있습니다. 지금 ${leaders.length}명: ${leaders.join(', ')}`)
  }
}

// 연구 장비
{
  const { name, items } = load(paths.equipment)
  const CATS = ['camera', 'sensor', 'computing']
  for (const [e, line] of items) {
    const at = `${name} ${line}번째 줄`
    if (blank(e?.name)) errors.push(`${at}: name(장비 이름)이 비어 있습니다.`)
    if (e?.category && !CATS.includes(e.category)) {
      errors.push(`${at}: category는 ${CATS.join(', ')} 중 하나입니다. (지금: ${e.category})`)
    }
    if (e?.photo && !existsSync(join(paths.equipmentImages, e.photo))) {
      errors.push(`${at}: 사진이 없습니다: public/images/equipment/${e.photo}`)
    }
    if (e?.specs && !Array.isArray(e.specs)) errors.push(`${at}: specs는 "- " 로 시작하는 목록이어야 합니다.`)
  }
}

if (errors.length) fail('데이터 검사', errors)
console.log('✔ 데이터 검사 통과 (세미나, 논문, 사람, 장비)')
