# AI 체험소설 v15d — 모든 보완사항 반영본

## 무엇이 보완되었나요?
- 첫 화면 404 문제를 막기 위해 **정식 Next.js 프로젝트** 구성 + 루트 페이지에서 `/public/index.html`을 iframe으로 표시
- `vercel.json` 추가로 프레임워크 감지 안정화
- README에 **Root Directory**/404 해결 절차 상세 명시

## 배포(터미널 없이, 무료 계정)
1) GitHub 새 저장소 → **Add file > Upload files** → 이 폴더 전체 업로드
   - 업로드 후 저장소 루트에 **package.json, app/, public/** 가 바로 보여야 합니다.
2) Vercel → **Add New… > Project** → 방금 만든 저장소 선택 → **Import**
3) 프로젝트 생성 중 **Environment Variables**에 추가
   - `OPENAI_API_KEY` = (본인 OpenAI 키)
4) **Deploy** → 완료 후 **Visit**

## 자주 발생하는 문제 & 해결
- 404/NOT_FOUND: Vercel **Settings > General > Root Directory**가 실제 파일이 있는 폴더인지 확인 → 수정 후 **Redeploy**
- 첫 화면 안 뜸: 저장소 루트에 `package.json`, `app/`, `public/index.html` 존재 확인
- 표지 이미지 안 보임: `OPENAI_API_KEY` 추가/철자 확인 → Redeploy
- `/index.html`로 접근하면 보이지만 `/`가 안 보임: 이 버전(v15d)로 해결됩니다.

행사 잘 진행되세요!
