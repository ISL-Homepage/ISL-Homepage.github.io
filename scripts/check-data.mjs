// data/*.yaml 을 검사한다. 문제가 있으면 파일, 줄 번호, 고칠 내용을 보여 주고 빌드를 멈춘다.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
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

/** 학기 파일처럼 맨 위가 key: value 인 yaml을 읽는다. 노드에서 줄 번호를 구하는 함수를 함께 돌려준다. */
function loadMap(file) {
  const name = relative(root, file).replace(/\\/g, '/')
  const lc = new LineCounter()
  const doc = parseDocument(readFileSync(file, 'utf8'), { lineCounter: lc })
  const lineOf = (node) => (node?.range ? lc.linePos(node.range[0]).line : 1)
  if (doc.errors.length) {
    for (const e of doc.errors) {
      errors.push(`${name} ${lc.linePos(e.pos[0]).line}번째 줄: yaml 형식 오류 (들여쓰기, 따옴표, 콜론 뒤 공백을 확인하세요)`)
    }
    return { name, doc: null, lineOf }
  }
  return { name, doc, lineOf }
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
  const KEYS = ['type', 'scope', 'year', 'authors', 'title', 'venue', 'text', 'url']
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
    if (p.url != null && !/^https?:\/\//.test(p.url)) errors.push(`${at}: url은 https:// 로 시작합니다. (지금: ${p.url})`)
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

// 강의 (data/lectures/<연도>-<학기>.yaml)
{
  const SEMESTERS = ['spring', 'fall']
  const TERM_KEYS = ['year', 'semester', 'ended', 'courses']
  const COURSE_KEYS = ['id', 'title', 'desc', 'materials', 'notices']
  const MATERIAL_KEYS = ['title', 'file']
  const NOTICE_KEYS = ['week', 'title', 'file', 'open']
  const ids = new Map()
  const files = existsSync(paths.lectures) ? readdirSync(paths.lectures).filter((f) => /\.ya?ml$/.test(f)) : []

  const checkFile = (f, at) => {
    if (f == null) return
    if (typeof f !== 'string' || blank(f)) errors.push(`${at}: file 값이 잘못되었습니다.`)
    else if (f.includes('#')) errors.push(`${at}: 파일 이름에 #을 쓸 수 없습니다.`)
    else if (!existsSync(join(paths.attachments, f))) errors.push(`${at}: 파일이 없습니다: public/attachments/${f}`)
  }

  for (const fname of files) {
    const { name, doc, lineOf } = loadMap(join(paths.lectures, fname))
    if (!doc) continue
    const term = doc.toJSON()
    if (!term || typeof term !== 'object' || Array.isArray(term)) {
      errors.push(`${name}: year, semester, courses 를 적어야 합니다.`)
      continue
    }
    const lineAt = (path) => lineOf(doc.getIn(path, true))
    const m = fname.match(/^(\d{4})-(spring|fall)\.ya?ml$/)
    if (!m) errors.push(`${name}: 파일 이름은 2026-spring.yaml 또는 2026-fall.yaml 형식이어야 합니다.`)
    if (!Number.isInteger(term.year)) {
      errors.push(`${name} ${lineAt(['year'])}번째 줄: year는 2026 처럼 숫자로 적습니다. (지금: ${term.year ?? '없음'})`)
    }
    if (!SEMESTERS.includes(term.semester)) {
      errors.push(`${name} ${lineAt(['semester'])}번째 줄: semester는 spring(1학기) 또는 fall(2학기) 입니다. (지금: ${term.semester ?? '없음'})`)
    }
    if (m && (String(term.year) !== m[1] || term.semester !== m[2])) {
      errors.push(`${name}: 파일 이름과 year, semester가 다릅니다. (파일: ${m[1]}-${m[2]}, 내용: ${term.year}-${term.semester})`)
    }
    if (term.ended != null && typeof term.ended !== 'boolean') {
      errors.push(`${name} ${lineAt(['ended'])}번째 줄: ended는 true 또는 false 입니다. (지금: ${term.ended})`)
    }
    for (const k of unknownKeys(term, TERM_KEYS)) errors.push(`${name}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: ${TERM_KEYS.join(', ')})`)
    if (!Array.isArray(term.courses)) {
      errors.push(`${name}: courses 목록이 없습니다.`)
      continue
    }

    term.courses.forEach((c, ci) => {
      const at = `${name} ${lineAt(['courses', ci])}번째 줄`
      if (!c || typeof c !== 'object') return errors.push(`${at}: 과목 형식이 잘못되었습니다.`)
      if (blank(c.id)) errors.push(`${at}: id(페이지 주소 이름)가 비어 있습니다.`)
      else if (!/^[a-z0-9-]+$/.test(c.id)) errors.push(`${at}: id는 영어 소문자, 숫자, - 만 씁니다. (지금: ${c.id})`)
      else {
        if (!existsSync(join(root, 'lecture', `${c.id}.md`))) {
          errors.push(`${at}: lecture/${c.id}.md 페이지가 없습니다. 기존 과목 md를 복사해 id만 바꿔 만드세요.`)
        }
        const key = `${term.year}-${c.id}`
        if (ids.has(key)) errors.push(`${at}: ${ids.get(key)}에 같은 해, 같은 id(${c.id})가 이미 있습니다.`)
        ids.set(key, name)
      }
      if (blank(c.title)) errors.push(`${at}: title(과목 이름)이 비어 있습니다.`)
      for (const k of unknownKeys(c, COURSE_KEYS)) errors.push(`${at}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: ${COURSE_KEYS.join(', ')})`)

      for (const [listKey, keys] of [['materials', MATERIAL_KEYS], ['notices', NOTICE_KEYS]]) {
        const list = c[listKey]
        if (list == null) continue
        if (!Array.isArray(list)) {
          errors.push(`${at}: ${listKey}는 "- " 로 시작하는 목록이어야 합니다.`)
          continue
        }
        const weeks = new Map()
        list.forEach((it, i) => {
          const line = lineAt(['courses', ci, listKey, i])
          const iat = `${name} ${line}번째 줄`
          if (!it || typeof it !== 'object') return errors.push(`${iat}: 항목 형식이 잘못되었습니다.`)
          for (const k of unknownKeys(it, keys)) errors.push(`${iat}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: ${keys.join(', ')})`)
          checkFile(it.file, iat)
          if (listKey === 'materials') {
            if (blank(it.title)) errors.push(`${iat}: title(자료 이름)이 비어 있습니다.`)
            return
          }
          if (it.week != null) {
            if (!Number.isInteger(it.week) || it.week < 1) errors.push(`${iat}: week는 3 처럼 숫자로 적습니다. (지금: ${it.week})`)
            else if (weeks.has(it.week)) errors.push(`${iat}: ${weeks.get(it.week)}번째 줄과 같은 ${it.week}주차입니다.`)
            else weeks.set(it.week, line)
          } else if (blank(it.title)) {
            errors.push(`${iat}: week가 없는 공지는 title(제목)을 적어야 합니다.`)
          }
          if (it.open != null && typeof it.open !== 'boolean') {
            errors.push(`${iat}: open은 true 또는 false 입니다. (지금: ${it.open})`)
          }
        })
      }
    })
  }
}

// 과제, 저서
{
  const { name, doc, lineOf } = loadMap(paths.projects)
  const data = doc?.toJSON()
  if (doc && (!data || typeof data !== 'object' || Array.isArray(data))) {
    errors.push(`${name}: projects, books 목록을 적어야 합니다.`)
  } else if (doc) {
    const PROJECT_KEYS = ['title', 'org', 'program', 'start', 'end']
    const BOOK_KEYS = ['title', 'authors', 'publisher', 'date', 'isbn', 'cover', 'url']
    for (const k of unknownKeys(data, ['projects', 'books'])) errors.push(`${name}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: projects, books)`)
    for (const [listKey, keys] of [['projects', PROJECT_KEYS], ['books', BOOK_KEYS]]) {
      const list = data[listKey] ?? []
      if (!Array.isArray(list)) {
        errors.push(`${name}: ${listKey}는 "- " 로 시작하는 목록이어야 합니다.`)
        continue
      }
      list.forEach((it, i) => {
        const at = `${name} ${lineOf(doc.getIn([listKey, i], true))}번째 줄`
        if (!it || typeof it !== 'object') return errors.push(`${at}: 항목 형식이 잘못되었습니다.`)
        if (blank(it.title)) errors.push(`${at}: title(제목)이 비어 있습니다.`)
        for (const k of unknownKeys(it, keys)) errors.push(`${at}: 알 수 없는 항목 "${k}" (쓸 수 있는 것: ${keys.join(', ')})`)
        if (listKey === 'projects') {
          if (blank(it.org)) errors.push(`${at}: org(발주 기관)가 비어 있습니다.`)
          for (const k of ['start', 'end']) {
            if (it[k] != null && !isDate(it[k])) errors.push(`${at}: ${k}는 2026-03-01 형식이어야 합니다. (지금: ${it[k]})`)
          }
          if (isDate(it.start) && isDate(it.end) && String(it.end) < String(it.start)) {
            errors.push(`${at}: end(종료일)가 start(시작일)보다 앞섭니다.`)
          }
        } else {
          if (blank(it.authors)) errors.push(`${at}: authors(저자)가 비어 있습니다.`)
          if (blank(it.publisher)) errors.push(`${at}: publisher(출판사)가 비어 있습니다.`)
          if (!isDate(it.date)) errors.push(`${at}: date는 2026-03-01 형식이어야 합니다. (지금: ${it.date ?? '없음'})`)
          if (it.cover && !existsSync(join(root, 'public/images/books', it.cover))) {
            errors.push(`${at}: 표지가 없습니다: public/images/books/${it.cover}`)
          }
          if (it.url && !/^https?:\/\//.test(it.url)) errors.push(`${at}: url은 https:// 로 시작해야 합니다.`)
        }
      })
    }
  }
}

if (errors.length) fail('데이터 검사', errors)
console.log('✔ 데이터 검사 통과 (세미나, 논문, 사람, 장비, 강의, 과제)')
