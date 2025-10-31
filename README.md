# AI 소설 체험 부스 — Vercel + GitHub

## 준비물
- Vercel 계정, GitHub 레포지토리
- Google AI Studio 발급 `GEMINI_API_KEY`
- 발신 Gmail(2단계 인증 + 앱 비밀번호)

## 배포 절차 (요약)
1) 이 폴더를 GitHub에 푸시
2) Vercel → New Project → GitHub 레포 Import
3) Project Settings → Environment Variables에 아래 3개 추가
   - `GEMINI_API_KEY` : (Google AI Studio 키)
   - `MAIL_USER` : 발신 Gmail 주소
   - `MAIL_PASS` : 앱 비밀번호
4) Deploy → `https://<project>.vercel.app` 접속
