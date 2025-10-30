# AI 체험소설 — 소설 생성 안 되던 문제 핫픽스(v15h)
- /api/story를 **Chat Completions(stream)** 로 변경(안정)
- 클라이언트 파서도 `{token}` 포맷으로 단순화
- OPENAI_API_KEY 미설정 시 명확한 오류 메시지

## 배포
1) 이 폴더 그대로 GitHub 업로드
2) Vercel에서 Import → Env에 `OPENAI_API_KEY` 추가 → Deploy
