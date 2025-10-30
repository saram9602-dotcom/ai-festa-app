# AI 체험소설 v15b — GitHub 웹 업로드 전용

이 버전은 **/public/index.html**에 클라이언트가 들어 있어 별도 설정 없이
Vercel에서 바로 정적 페이지로 열립니다. API는 /app/api/story, /app/api/cover 그대로 사용.

## 배포 순서(터미널 없이)
1) GitHub에서 새 저장소 만들기 → "Add file > Upload files" → 이 폴더 전체 업로드
2) Vercel 대시보드에서 "New Project" → "Import Git Repository" → 방금 만든 저장소 선택
3) Project Settings에서 Environment Variable 추가
   - OPENAI_API_KEY = (본인 키)
4) Deploy → 완료 후 제공된 주소로 접속
