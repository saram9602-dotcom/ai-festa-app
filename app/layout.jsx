export const metadata = { title: "AI 체험소설" };
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{margin:0}}>{children}</body>
    </html>
  );
}
