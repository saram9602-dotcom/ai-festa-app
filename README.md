# AI 소설 생성기 — 최종 완성팩 (Vercel Upload 전용)

## 구성
- `public/index.html` : 프런트 (질문 4개 + 진행바 + 한 글자씩 타이핑)
- `api/story.ts`      : Edge Function (OpenAI Responses API 스트리밍)
- `vercel.json`       : 업로드형 배포에서 Edge 런타임 보장

## 배포 (터미널 불필요)
1) https://vercel.com/new → **Upload** → 이 폴더(ZIP) 통째로 올리기 → **Deploy**
2) 배포 후 **Settings → Environment Variables** 에 추가
   - Name: `OPENAI_API_KEY`
   - Value: (OpenAI에서 발급한 키, 예: `sk-...`)
   - Environment: Production + Preview 체크 → Save
   - 상단 **Redeploy**
3) 새로고침: 메인 페이지에서 ‘예시로 자동 완성’ → ‘소설 생성’ → 한 글자씩 출력 확인

## 점검 팁
- `/api/story` 를 브라우저에서 열었을 때 `Method Not Allowed`(405)면 함수 인식 OK
- 404면 업로드 경로 확인: 최상단에 `api/story.ts` 와 `public/index.html` 이 있어야 함
- 멈추면 새로고침 후 재시도. 계속되면 OpenAI 키/크레딧/모델 접근권 확인
