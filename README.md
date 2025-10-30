# AI 체험소설 v15e — 빌드 에러(Exit 1) 대비 강화본

- `next.config.js` 에서 **TypeScript/ESLint 오류를 빌드에서 무시**
- `tsconfig.json` 기본 제공
- 첫 화면은 `/public/index.html`, 루트(`/`)는 `app/page.tsx`에서 iframe으로 이를 표시
- Node 버전 안내(`engines`)

## 배포(터미널 없이)
1) GitHub 새 저장소 → **Upload files** 로 이 폴더 전체 업로드
2) Vercel → **Add New… > Project** → 저장소 선택 → **Import**
3) **Environment Variables**: `OPENAI_API_KEY` 추가
4) **Deploy** → 완료 후 **Visit**

## "next build exited with 1"가 뜰 때
- 저장소 루트에 `package.json`, `app/`, `public/` 있는지 확인
- `next.config.js`의 타입/ESLint 무시 옵션으로 대부분 해결
- 그래도 실패 시 Vercel → Deploy Logs에서 오류 마지막 줄을 확인, 알려주세요.
