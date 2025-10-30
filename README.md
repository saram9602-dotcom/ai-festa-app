# AI 체험소설 v15f — TypeScript 없는 빌드 안정판

## 왜 v15f인가요?
- TypeScript/tsconfig, .tsx 파일을 **모두 제거**하고 JS(.js/.jsx)만 사용합니다.
- 그래서 `next build`가 `typescript @types/react @types/node`를 요구하지 않습니다.
- 루트(`/`)는 `app/page.jsx`가 `/public/index.html`을 iframe으로 표시합니다.

## 배포(터미널 없이)
1) GitHub 새 저장소 → **Upload files** 로 이 폴더 전체 업로드
   - 루트에 `package.json`, `app/`, `public/`, `next.config.js`가 바로 보여야 합니다.
2) Vercel → **Add New… > Project** → 저장소 선택 → **Import**
3) **Environment Variables**: `OPENAI_API_KEY` 추가
4) **Deploy** → **Visit**

## 자주 나오는 오류 해결
- **Error: Please install typescript...** → v15f는 TS가 없으므로 발생하지 않습니다.
- **404/NOT_FOUND** → Vercel Settings > Root Directory가 저장소 루트인지 확인 → 필요 시 폴더명 지정 후 Redeploy
- **표지 안 나옴** → OPENAI_API_KEY 값/철자 확인 → Redeploy

행사 잘 되세요!
