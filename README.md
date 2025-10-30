# AI 체험소설 생성기 v15 — 서버 연결 배포 키트

이 키트는 **질문 → 소설 작성 → 표지 그림 생성**까지 한 번에 동작하도록 구성되어 있습니다.
프런트는 단일 HTML 파일이며, 서버(Next.js Route Handler)는 2개의 엔드포인트를 제공합니다.

## 빠른 배포(Next.js + Vercel 기준)

1) 새 Vercel 프로젝트 생성 → 이 폴더를 레포로 연결
2) 환경변수 설정
   - `OPENAI_API_KEY`: OpenAI API 키
3) `app/api/story/route.ts`, `app/api/cover/route.ts` 그대로 사용
4) `frontend/ai-experience-novel-v15-client.html`을 정적 파일로 서빙하거나,
   Next.js 페이지로 옮겨서 사용(또는 Vercel Static에 업로드)

※ 개발 중엔 `vercel dev` 또는 `npm run dev`(Next.js)로 로컬 테스트 후 배포하세요.

## 엔드포인트
- `POST /api/story` : 질문 답변(4개)을 입력 → **토큰 단위**로 소설 본문 **흘러나옴**
- `POST /api/cover` : 주제/키워드 입력 → `base64` PNG 반환

## 보안
- API 키는 반드시 서버 환경변수로 보관
- 필요 시 CORS의 `Access-Control-Allow-Origin`를 학교 도메인으로 제한

## 참고 문서
- OpenAI Streaming 가이드(Responses)  
- OpenAI 이미지 생성(gpt-image-1)  
- Vercel Functions / Route Handlers
