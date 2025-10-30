export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { topic, answers } = await req.json();

    const sys = `너는 초등학생 체험소설 작가다.
- 사용자가 적은 단어를 그대로 복붙하지 말고 자연스럽게 재서술해 문단을 만든다.
- 문단 4개, 각 문단 5~7문장. 대사는 0~2문장만.
- 과장/비약/억지 전개 금지. 일상적이고 그럴듯하게.
- 문단 제목 없이, 앞에 전각 공백으로 들여쓰기.`;

    // 스트리밍 비활성화: 한 번에 받아오기
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: false,
        input: [
          { role: "system", content: sys },
          {
            role: "user",
            content:
`주제: ${topic}
질문1: 무엇을 보거나 만들었나요? -> ${answers?.[0] ?? ""}
질문2: 누구와 함께 했나요? -> ${answers?.[1] ?? ""}
질문3: 가장 재미있었던 순간은? -> ${answers?.[2] ?? ""}
질문4: 돌아올 때 마음은? -> ${answers?.[3] ?? ""}
요구사항: 문단 제목(발단/전개 등) 표시 없이 연속 문단으로 인쇄. 각 문단은 전각 공백(\\u3000)으로 들여쓰기.`
          }
        ]
      })
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return new Response(JSON.stringify({ error: err }), {
        status: upstream.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const data = await upstream.json();
    const text =
      data?.output_text ||
      data?.choices?.[0]?.message?.content ||
      "";

    // 프런트는 SSE처럼 받도록 되어 있으니, 여기서 "가짜 SSE" 형식으로 감싸줍니다.
    const ssePayload = `data: ${JSON.stringify({ output_text: text })}\n\ndata: [DONE]\n\n`;

    return new Response(ssePayload, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
