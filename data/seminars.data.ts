import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export interface Seminar {
  date: string
  title: string
  speaker: string
  desc?: string
  file?: string
}

export interface SeminarYear {
  year: string
  items: Seminar[]
}

declare const data: SeminarYear[]
export { data }

export default {
  watch: ['./seminars.yaml'],
  load([file]: string[]): SeminarYear[] {
    const list: Seminar[] = parse(readFileSync(file, 'utf8')) ?? []
    list.sort((a, b) => String(b.date).localeCompare(String(a.date)))
    const years = new Map<string, Seminar[]>()
    for (const s of list) {
      const year = String(s.date).slice(0, 4)
      if (!years.has(year)) years.set(year, [])
      years.get(year)!.push({ ...s, date: String(s.date) })
    }
    return [...years].map(([year, items]) => ({ year, items }))
  }
}
