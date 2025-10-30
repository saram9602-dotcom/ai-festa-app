# AI 체험소설 — 터미널 없이 배포 가능한 깔끔한 버전 (버전 표기 제거)

## 구성
- **public/index.html** : 완성된 인터페이스(대화형 질문, 진행바, 실시간 타이핑 표시, 표지 자동 생성, 복사/다운로드/메일 전송)
- **app/api/story** : ChatGPT 소설 생성(SSE 스트리밍)
- **app/api/cover** : 표지 이미지 생성(base64 PNG)
- **app/layout.jsx / app/page.jsx** : 루트(/)에서 index.html을 바로 보여줌(첫 화면 보장)
- **next.config.js** : 빌드 린트 무시(불필요한 실패 방지)

## 배포 (무료, 터미널 없음)
1) GitHub 새 저장소 → **Upload files** 로 이 폴더 전체 업로드
   - 업로드 후 저장소 루트에 `package.json`, `app/`, `public/`, `next.config.js`가 바로 보이는지 확인
2) Vercel → **Add New… → Project** → 방금 만든 저장소 선택 → **Import**
3) “Environment Variables”에 추가
   - `OPENAI_API_KEY` = (본인 OpenAI 키)
4) **Deploy** → **Visit** 로 접속

## 문제 해결
- 404/NOT_FOUND → Vercel Settings > General > **Root Directory**가 실제 루트인지 확인 → 필요 시 폴더명 지정 후 Redeploy
- 첫 화면이 안 보임 → 저장소 루트에 `package.json`, `app/`, `public/index.html`이 있어야 함
- 표지/소설이 안 만들어짐 → 환경변수 `OPENAI_API_KEY` 철자/값 확인 → Redeploy

행사 화이팅! 🙌
