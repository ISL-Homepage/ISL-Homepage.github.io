import type { Term } from '../../data/lectures.data'

export const SEMESTER_LABEL = { spring: '1학기', fall: '2학기' } as const

/**
 * 종강 여부. 1학기는 그해 7월 1일, 2학기는 다음 해 1월 1일부터 자동으로 종강으로 본다.
 * 그 전에 닫고 싶으면 yaml에 ended: true 를 적는다.
 * 방문자 브라우저의 오늘 날짜로 판단하므로 다시 배포하지 않아도 날짜가 지나면 바뀐다.
 */
export function isEnded(term: Term, now = new Date()): boolean {
  if (term.ended) return true
  const end = term.semester === 'spring' ? new Date(term.year, 6, 1) : new Date(term.year + 1, 0, 1)
  return now >= end
}
