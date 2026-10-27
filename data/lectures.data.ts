import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export type Semester = 'spring' | 'fall'

export interface LectureFile {
  title: string
  file?: string
}

export interface Notice extends LectureFile {
  week?: number
  open: boolean
}

export interface Course {
  id: string
  title: string
  desc?: string
  materials: LectureFile[]
  notices: Notice[]
}

export interface Term {
  year: number
  semester: Semester
  courses: Course[]
}

export interface LectureData {
  /** 화면에 보여 줄 연도 (가장 최근 학기 파일의 연도) */
  latestYear: number
  /** 모든 학기, 최신순 */
  terms: Term[]
}

declare const data: LectureData
export { data }

const order = (t: Term) => t.year * 10 + (t.semester === 'fall' ? 2 : 1)

export default {
  watch: ['./lectures/*.yaml'],
  load(files: string[]): LectureData {
    const terms: Term[] = files.map((file) => {
      const raw = parse(readFileSync(file, 'utf8')) ?? {}
      return {
        year: Number(raw.year),
        semester: raw.semester,
        courses: (raw.courses ?? []).map((c: any) => ({
          id: String(c.id),
          title: String(c.title),
          desc: c.desc,
          materials: (c.materials ?? []).map((m: any) => ({ title: String(m.title), file: m.file })),
          notices: (c.notices ?? [])
            .map((n: any) => ({
              week: n.week,
              title: n.title ? String(n.title) : `${n.week}주차 실험 공지`,
              file: n.file,
              open: n.open === true
            }))
            // 주차순, 주차 없는 공지는 맨 아래
            .sort((a: Notice, b: Notice) => (a.week ?? Infinity) - (b.week ?? Infinity))
        }))
      }
    })
    terms.sort((a, b) => order(b) - order(a))
    return { latestYear: terms[0]?.year ?? new Date().getFullYear(), terms }
  }
}
