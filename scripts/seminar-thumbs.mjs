// 세미나 PDF의 첫 페이지를 썸네일(webp)로 만든다. docs:dev / docs:build 전에 자동 실행된다.
// 이미 만든 썸네일은 PDF가 더 새로울 때만 다시 만든다. 결과물은 git에 올리지 않는다.
import { mkdirSync, readdirSync, statSync, existsSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas } from '@napi-rs/canvas'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pdfRoot = join(root, 'public/attachments/seminar')
const outRoot = join(root, 'public/thumbs/seminar')
const WIDTH = 480
const pdfjsDir = join(root, 'node_modules/pdfjs-dist').replace(/\\/g, '/')

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n)
    return statSync(p).isDirectory() ? walk(p) : p.toLowerCase().endsWith('.pdf') ? [p] : []
  })

async function render(pdfPath, outPath) {
  const data = new Uint8Array(readFileSync(pdfPath))
  const task = getDocument({
    data,
    isEvalSupported: false,
    verbosity: 0,
    // 한글 등 CJK 글꼴과 표준 글꼴을 제대로 그리기 위한 데이터
    cMapUrl: pdfjsDir + '/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: pdfjsDir + '/standard_fonts/'
  })
  const doc = await task.promise
  try {
    const page = await doc.getPage(1)
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: WIDTH / base.width })
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height))
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, canvas, viewport }).promise
    mkdirSync(dirname(outPath), { recursive: true })
    await writeFile(outPath, await canvas.encode('webp', 80))
  } finally {
    await task.destroy()
  }
}

let made = 0
let failed = 0
for (const pdf of walk(pdfRoot)) {
  const rel = relative(pdfRoot, pdf).replace(/\.pdf$/i, '.webp')
  const out = join(outRoot, rel)
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(pdf).mtimeMs) continue
  try {
    await render(pdf, out)
    made++
  } catch (e) {
    failed++
    console.warn(`[thumbs] ${relative(root, pdf)}: ${e.message}`)
  }
}
if (made || failed) console.log(`[thumbs] 생성 ${made}개, 실패 ${failed}개`)
