# 옛 Jekyll 사이트에서 옮긴 기록

## 지금 구조

옛 저장소 `ISL-Homepage/ISL-Homepage.github.io`를 그대로 씁니다. 주소도 https://isl-homepage.github.io 그대로입니다.

- `source` 브랜치: VitePress 소스
- `master` 브랜치: 빌드 결과물. GitHub Pages가 이 브랜치(루트)를 보여 줌
- `npm run deploy`가 `source`를 빌드해 `master`를 통째로 바꾸고 `.nojekyll`을 넣습니다.
- 옛 Jekyll 주소 중 이름이 바뀐 것(`/seminar/seminar/`, `/lecture_spring/experiments/` 등)은 `scripts/deploy.mjs`의 `OLD_PATHS`가 이동 페이지를 만들고,
  끝에 `/`만 붙은 옛 주소(`/research/interests/` 등)는 `404.html`이 `/`를 떼고 새 주소로 보냅니다.

`ISL-Homepage`는 개인 계정이고 로그인할 수 없어(메일 인증 단계에서 막힘) 저장소 설정(Pages 소스, 콜라보레이터)은 바꿀 수 없습니다.
그래서 GitHub Actions 대신, 이미 설정된 "master 브랜치 배포"를 그대로 쓰는 방식을 택했습니다. write 권한만 있으면 됩니다.

## 옮기는 순서 (2026-10)

1. `npm run deploy:preview`로 https://isl-homepage.github.io/temp/ 에 새 사이트를 올려 확인받기 (옛 사이트는 그대로)
2. 확인되면 `npm run deploy`로 정식 배포. `master`의 Jekyll 파일은 빌드 결과물로 바뀌고, `temp/`도 함께 사라집니다
3. 옛 Jekyll 소스는 `master`의 git 기록에 그대로 남아 있습니다. 필요하면 `git log origin/master`에서 꺼낼 수 있습니다

## 나중에 조직으로 옮기려면 (선택)

한 사람 계정에 묶여 있으면 지금처럼 로그인을 잃었을 때 설정을 바꿀 수 없습니다. 여유가 생기면 조직으로 옮기는 것을 권장합니다.

1. GitHub에서 조직을 만들고(Free 플랜이면 충분) 공개 저장소 `<조직>.github.io`를 만듭니다.
2. 이 저장소의 `source`와 `master` 브랜치를 그대로 push 하고, Settings → Pages에서 `master` 브랜치(루트)를 배포 소스로 고릅니다.
3. **owner는 최소 2명**(교수님 포함 권장), owner 계정은 2단계 인증을 켜고 복구 코드는 랩 공용 위치에 보관합니다.
4. 옛 주소에서 넘기려면 이 저장소 `master`에 새 주소로 보내는 `index.html`, `404.html`, `.nojekyll`만 남깁니다.
