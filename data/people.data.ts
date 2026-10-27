import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export interface Person {
  name: string
  affiliation?: string
  photo?: string
}

export interface PeopleGroup {
  group: string
  members: Person[]
}

declare const data: PeopleGroup[]
export { data }

export default {
  watch: ['./people.yaml'],
  load([file]: string[]): PeopleGroup[] {
    return parse(readFileSync(file, 'utf8')) ?? []
  }
}
