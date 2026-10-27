import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export interface Publication {
  type: 'journal' | 'conference'
  scope: 'international' | 'domestic'
  year: number
  authors?: string
  title?: string
  venue?: string
  text?: string
  url?: string
}

declare const data: Publication[]
export { data }

export default {
  watch: ['./publications.yaml'],
  load([file]: string[]): Publication[] {
    const list: Publication[] = parse(readFileSync(file, 'utf8')) ?? []
    // 연도 내림차순, 같은 해에서는 저널 먼저, 국제 먼저 (원래 순서 유지)
    const rank = (p: Publication) => (p.type === 'journal' ? 0 : 2) + (p.scope === 'international' ? 0 : 1)
    return list
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p.year - a.p.year || rank(a.p) - rank(b.p) || a.i - b.i)
      .map(({ p }) => p)
  }
}
