import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export interface Project {
  title: string
  org: string
  program?: string
  start?: string
  end?: string
}

export interface Book {
  title: string
  authors: string
  publisher: string
  date: string
  isbn?: string
  /** public/images/books/ 안의 파일 이름 */
  cover?: string
  url?: string
}

export interface ProjectData {
  /** end가 없는 과제 */
  ongoing: Project[]
  /** 끝난 과제, 시작일 최신순 */
  done: Project[]
  books: Book[]
}

declare const data: ProjectData
export { data }

const str = (v: unknown) => (v == null ? undefined : String(v))
const byDateDesc = (a?: string, b?: string) => String(b ?? '').localeCompare(String(a ?? ''))

export default {
  watch: ['./projects.yaml'],
  load([file]: string[]): ProjectData {
    const raw = parse(readFileSync(file, 'utf8')) ?? {}
    const projects: Project[] = (raw.projects ?? []).map((p: any) => ({
      title: String(p.title),
      org: String(p.org),
      program: str(p.program),
      start: str(p.start),
      end: str(p.end)
    }))
    projects.sort((a, b) => byDateDesc(a.start, b.start))
    const books: Book[] = (raw.books ?? []).map((b: any) => ({
      title: String(b.title),
      authors: String(b.authors),
      publisher: String(b.publisher),
      date: String(b.date),
      isbn: str(b.isbn),
      cover: str(b.cover),
      url: str(b.url)
    }))
    books.sort((a, b) => byDateDesc(a.date, b.date))
    return {
      ongoing: projects.filter((p) => !p.end),
      done: projects.filter((p) => p.end),
      books
    }
  }
}
