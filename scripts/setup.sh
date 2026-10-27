#!/usr/bin/env sh
# 처음 한 번 실행하는 준비 스크립트. 이미 설치된 것은 건너뛴다.
#   sh scripts/setup.sh      (Windows는 Git Bash에서 실행)
#
# 1) Node.js 20 이상이 없으면 설치 (Windows: winget, macOS: Homebrew, 그 밖: 안내만)
# 2) npm ci 로 패키지 설치
# 3) npm run data 로 데이터 검사와 세미나 썸네일 생성
set -e
cd "$(dirname "$0")/.."

ok() { printf '\033[32m✔\033[0m %s\n' "$1"; }
step() { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }
fail() { printf '\n\033[31m✖ %s\033[0m\n' "$1"; exit 1; }

node_major() { node -v 2>/dev/null | sed 's/^v\([0-9]*\).*/\1/'; }

step "Node.js 확인"
if [ -n "$(node_major)" ] && [ "$(node_major)" -ge 20 ]; then
  ok "Node.js $(node -v) 이미 설치됨"
else
  case "$(uname -s)" in
    MINGW* | MSYS* | CYGWIN*)
      command -v winget >/dev/null 2>&1 || fail "winget이 없습니다. https://nodejs.org 에서 LTS를 설치한 뒤 다시 실행하세요."
      echo "winget으로 Node.js LTS를 설치합니다..."
      winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
      # 새로 설치한 node 는 새 터미널부터 PATH에 잡힌다. 이번 실행에서는 기본 설치 위치를 직접 추가한다.
      PATH="/c/Program Files/nodejs:$PATH"
      ;;
    Darwin)
      command -v brew >/dev/null 2>&1 || fail "Homebrew가 없습니다. https://nodejs.org 에서 LTS를 설치한 뒤 다시 실행하세요."
      brew install node@22 && brew link --overwrite node@22
      ;;
    *)
      fail "Node.js 20 이상이 필요합니다. https://nodejs.org 또는 nvm 으로 설치한 뒤 다시 실행하세요."
      ;;
  esac
  [ -n "$(node_major)" ] && [ "$(node_major)" -ge 20 ] || fail "Node.js 설치를 확인하지 못했습니다. 터미널을 새로 연 뒤 다시 실행하세요."
  ok "Node.js $(node -v) 설치 완료"
fi

step "git 설정 확인"
git config core.quotepath false # 한글 파일 이름이 \354\240... 처럼 보이지 않게
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
  echo "  커밋에 쓸 이름과 메일이 없습니다. 아래처럼 한 번 설정하세요."
  echo '  git config --global user.name "홍길동"'
  echo '  git config --global user.email "you@example.com"'
else
  ok "커밋 사용자: $(git config user.name) <$(git config user.email)>"
fi

step "패키지 설치 (npm ci)"
npm ci
ok "패키지 설치 완료"

step "데이터 검사, 세미나 썸네일 생성 (npm run data)"
npm run data

printf '\n\033[32m✔ 준비 끝\033[0m\n'
echo "  npm run dev               내 컴퓨터에서 미리 보기 (http://localhost:5173)"
echo "  npm run deploy            사이트에 배포"
