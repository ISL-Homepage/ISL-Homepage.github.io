// favicon 만들기: public/images/ISL_Logo.png 의 빨간 ISL 글자만 뽑아 흰색으로 바꾸고,
// 검은 둥근 사각형 위에 올린다 (흑백 모노그램).
// 실행: node tools/make-favicon.mjs
// 결과: public/favicon.ico (16, 32, 48), public/favicon.png (192), public/apple-touch-icon.png (180)
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { root } from '../scripts/lib.mjs'

const BACKGROUND = '#111111' // 바탕색 (글자는 흰색)

// 로고에서 빨간 부분을 흰 글자 마스크로 바꾼다
const logo = await loadImage(join(root, 'public/images/ISL_Logo.png'))
const src = createCanvas(logo.width, logo.height)
const sctx = src.getContext('2d')
sctx.drawImage(logo, 0, 0)
const img = sctx.getImageData(0, 0, logo.width, logo.height)
let [x0, y0, x1, y1] = [logo.width, logo.height, 0, 0]
for (let i = 0; i < img.data.length; i += 4) {
  const [r, g, b, a] = img.data.slice(i, i + 4)
  const red = Math.max(0, r - (g + b) / 2) / 180 // 순수한 빨강일수록 1
  const alpha = Math.min(1, red) * (a / 255)
  img.data.set([255, 255, 255, Math.round(alpha * 255)], i)
  if (alpha > 0.3) {
    const p = i / 4
    const x = p % logo.width
    const y = Math.floor(p / logo.width)
    x0 = Math.min(x0, x)
    y0 = Math.min(y0, y)
    x1 = Math.max(x1, x)
    y1 = Math.max(y1, y)
  }
}
sctx.putImageData(img, 0, 0)

function icon(size) {
  const c = createCanvas(size, size)
  const ctx = c.getContext('2d')
  const r = size * 0.22
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, r)
  ctx.clip()
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, size, size)
  // 글자는 정사각형의 76% 안에 맞춘다
  const w = x1 - x0 + 1
  const h = y1 - y0 + 1
  const scale = (size * 0.76) / Math.max(w, h)
  const dw = w * scale
  const dh = h * scale
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src, x0, y0, w, h, (size - dw) / 2, (size - dh) / 2, dw, dh)
  return c.toBuffer('image/png')
}

/** PNG 여러 장을 담은 .ico 파일 */
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = header.length
  pngs.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, e)
    header.writeUInt8(size >= 256 ? 0 : size, e + 1)
    header.writeUInt16LE(1, e + 4)
    header.writeUInt16LE(32, e + 6)
    header.writeUInt32LE(png.length, e + 8)
    header.writeUInt32LE(offset, e + 12)
    offset += png.length
  })
  return Buffer.concat([header, ...pngs.map((p) => p.png)])
}

const out = (f) => join(root, 'public', f)
writeFileSync(out('favicon.ico'), ico([16, 32, 48].map((size) => ({ size, png: icon(size) }))))
writeFileSync(out('favicon.png'), icon(192))
writeFileSync(out('apple-touch-icon.png'), icon(180))
console.log('✔ favicon.ico, favicon.png, apple-touch-icon.png 생성')
