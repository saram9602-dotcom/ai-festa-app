export const metadata = { title: "AI 체험소설 v15d" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{margin:0}}>{children}</body>
    </html>
  );
}
