// 홈 화면 카드 이미지 만들기. 연구실의 실제 결과 이미지로 카드 썸네일을 만든다.
// 실행: node tools/make-home-cards.mjs  (세미나 썸네일이 필요하므로 npm run data 를 한 번 돌린 뒤 실행)
// 결과: public/images/home/*.jpg (920x400, 카드 비율 2.3:1)
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { root } from '../scripts/lib.mjs'

const W = 920
const H = 400
const img = (p) => loadImage(join(root, 'public', p))

/** 이미지를 칸에 꽉 채운다. 넘치는 부분은 잘리며 fx, fy(0~1)로 남길 위치를 고른다 (기본: 가운데) */
function cover(ctx, im, x, y, w, h, fx = 0.5, fy = 0.5) {
  const s = Math.max(w / im.width, h / im.height)
  const sw = w / s
  const sh = h / s
  ctx.drawImage(im, (im.width - sw) * fx, (im.height - sh) * fy, sw, sh, x, y, w, h)
}

function canvas(bg) {
  const c = createCanvas(W, H)
  const ctx = c.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  return { c, ctx }
}

const cards = {
  // 연구 분야: 프레임률 증가, 안개 제거, SLAM, 레티넥스 2x2. [파일, 가로 위치, 세로 위치]
  async research() {
    const { c, ctx } = canvas('#1b1b1f')
    const g = 6
    const tw = (W - g) / 2
    const th = (H - g) / 2
    const tiles = [
      ['images/FRUC02.png', 0.2, 0.4],
      ['images/DEHAZING02.png', 0.5, 0.5],
      ['images/SLAM02.png', 0.5, 0.5],
      ['images/MSR01.png', 1, 0.5]
    ]
    for (const [i, [p, fx, fy]] of tiles.entries()) {
      cover(ctx, await img(p), (i % 2) * (tw + g), Math.floor(i / 2) * (th + g), tw, th, fx, fy)
    }
    return c
  },
  // 세미나: 여러 해의 실제 발표 자료 첫 페이지 4x2 모자이크
  async seminar() {
    const { c, ctx } = canvas('#1b1b1f')
    const files = [
      '2014/-Unlicensed-20140108_김진형_LineSegmentation_Extraction.webp',
      '2017/-Unlicensed-20170306_전현호_tensorflow.webp',
      '2014/-Unlicensed-20140923_강한솔_Harris Corner Detector.webp',
      '2017/20170206_강한솔_Basic of ML.webp',
      '2015/-Unlicensed-20150209_유용길_Strereo Triangulation.webp',
      '2014/-Unlicensed-20140425_김진형_BumbleBee.webp',
      '2015/-Unlicensed-20150424_안병민.webp',
      '2014/-Unlicensed-20140704_유용길_Semi-Global Matching 추가 이론 및 구현 PTAM Introduce.webp'
    ]
    const g = 6
    const tw = (W - g * 3) / 4
    const th = (H - g) / 2
    for (const [i, f] of files.entries()) {
      cover(ctx, await img(`thumbs/seminar/${f}`), (i % 4) * (tw + g), Math.floor(i / 4) * (th + g), tw, th)
    }
    return c
  }
}

const dir = join(root, 'public/images/home')
mkdirSync(dir, { recursive: true })
for (const [name, make] of Object.entries(cards)) {
  writeFileSync(join(dir, `${name}.jpg`), (await make()).toBuffer('image/jpeg', 85))
}
console.log(`✔ 홈 카드 이미지 ${Object.keys(cards).length}장 생성: public/images/home/`)
