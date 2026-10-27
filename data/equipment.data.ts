import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export interface Equipment {
  name: string
  category?: 'camera' | 'sensor' | 'computing'
  photo?: string
  specs?: string[]
}

declare const data: Equipment[]
export { data }

export default {
  watch: ['./equipment.yaml'],
  load([file]: string[]): Equipment[] {
    return parse(readFileSync(file, 'utf8')) ?? []
  }
}
