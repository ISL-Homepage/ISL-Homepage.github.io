# 홈페이지 이전 절차

옛 사이트 `https://isl-homepage.github.io`(개인 계정 `ISL-Homepage` 소유, Jekyll)를
조직 `isl-cnu`의 새 사이트 `https://isl-cnu.github.io`(VitePress)로 옮기는 절차입니다.

## 배경

- `ISL-Homepage`는 조직이 아니라 개인 계정이고, 지금은 로그인할 수 없습니다(메일 인증 단계에서 막힘).
- GitHub에서는 개인 계정을 조직으로 바로 바꿀 수 없습니다.
- 옛 저장소에는 write 권한이 있으므로 파일 수정과 push는 할 수 있습니다. 저장소 이전, 설정 변경, 콜라보레이터 관리는 할 수 없습니다.

## 1. 새 사이트 열기

1. GitHub 웹에서 조직 `isl-cnu`를 만듭니다(Free 플랜이면 충분합니다).
2. 조직 안에 공개 저장소 `isl-cnu.github.io`를 만듭니다. README 없이 빈 저장소로 만듭니다.
3. 로컬 저장소에서 push 합니다.
   ```bash
   git remote add origin git@github.com:isl-cnu/isl-cnu.github.io.git
   git push -u origin main
   ```
4. 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다.
   `.github/workflows/deploy.yml`이 실행되면서 배포됩니다(Actions 탭에서 확인).
5. `https://isl-cnu.github.io`에서 메뉴, 세미나 PDF, 강의 첨부가 잘 열리는지 확인합니다.

## 2. 사람 초대

- 조직 People에서 랩원을 초대합니다.
- **owner는 최소 2명**(교수님 포함 권장)으로 둡니다. 한 사람만 owner면 지금 `ISL-Homepage`와 같은 일이 생깁니다.
- 학생은 저장소 write(또는 조직 member) 권한이면 충분합니다.
- 조직 owner 계정에는 2단계 인증을 켜고, 복구 코드는 랩 공용 위치에 보관합니다.

## 3. 옛 주소에서 새 주소로 넘기기

새 사이트가 정상인 것을 확인한 다음에 진행합니다.

1. 옛 저장소 `ISL-Homepage/ISL-Homepage.github.io`를 clone 합니다.
2. master 브랜치의 파일을 모두 지우고 `tools/redirect-stub/`의 파일 3개(`index.html`, `404.html`, `.nojekyll`)만 넣어 커밋하고 push 합니다.
   - git 기록은 그대로 남습니다. 옛 내용은 언제든 기록에서 꺼낼 수 있습니다.
3. 확인할 것:
   - `https://isl-homepage.github.io/seminar/seminar/` → `https://isl-cnu.github.io/seminar/`
   - `https://isl-homepage.github.io/lecture_spring/experiments/` → `https://isl-cnu.github.io/lecture/experiments`
   - `https://isl-homepage.github.io/attachments/...` → 같은 경로의 새 파일

GitHub Pages는 없는 경로에 `404.html`을 보여 주므로, 어떤 옛 주소로 들어와도 새 주소의 같은 경로로 이동합니다.
옛 Jekyll 경로와 새 경로가 다른 페이지는 스텁 안의 `MAP`에 적혀 있습니다.

## 4. (선택) 나중에 `ISL-Homepage` 로그인을 되찾으면

원래 이름과 주소(`isl-homepage.github.io`)를 조직 이름으로 되찾을 수 있습니다.

1. `ISL-Homepage` 계정 Settings에서 계정 이름을 다른 이름으로 바꿉니다.
2. 조직 `isl-cnu`의 이름을 `ISL-Homepage`로 바꾸고, 저장소 이름도 `ISL-Homepage.github.io`로 바꿉니다.
3. 리디렉션 스텁은 더 이상 필요 없습니다.

이름을 바꾸면 GitHub이 저장소 URL은 자동으로 넘겨 주지만, Pages 주소(`*.github.io`)는 넘겨 주지 않습니다. 진행 전에 순서를 다시 확인하세요.
