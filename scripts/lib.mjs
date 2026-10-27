// scripts/ 공용: 경로와 메시지 출력
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export const paths = {
  seminars: join(root, 'data/seminars.yaml'),
  publications: join(root, 'data/publications.yaml'),
  people: join(root, 'data/people.yaml'),
  equipment: join(root, 'data/equipment.yaml'),
  seminarPdfs: join(root, 'public/attachments/seminar'),
  peopleImages: join(root, 'public/images/people'),
  equipmentImages: join(root, 'public/images/equipment')
}

const red = (s) => `\x1b[31m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`

/** 오류 목록을 보여 주고 종료한다 (빌드, 배포 중단). */
export function fail(title, errors) {
  console.error(`\n${red(`✖ ${title}: 고쳐야 할 곳 ${errors.length}개`)}`)
  for (const e of errors) console.error(`  - ${e}`)
  console.error('')
  process.exit(1)
}

/** 처리 결과를 보여 준다. */
export function report(title, lines, hint) {
  console.log(`\n${green(`✔ ${title}`)}`)
  for (const l of lines) console.log(`  - ${l}`)
  if (hint) console.log(`  ${hint}`)
  console.log('')
}
