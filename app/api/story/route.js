\
export const runtime = "edge";

// Stream OpenAI chat completions (stable parser)
export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  try {
    const { topic = "자유 주제", answers = [] } = await req.json();
    const sys = `너는 초등학생 체험소설 작가다.
- 사용자의 단편 답변을 참고하되 그대로 복붙하지 말고 자연스럽게 재서술해 문단을 만든다.
- 문단 4개, 각 문단 5~7문장. 대사는 0~2문장만.
- 과장/비약/억지 전개 금지. 일상적이고 그럴듯하게.
- 문단 제목 없이, 앞에 전각 공백으로 들여쓰기.`;

    const user = `주제: ${topic}
질문1: 무엇을 보거나 만들었나요? -> ${answers?.[0] ?? ""}
질문2: 누구와 함께 했나요? -> ${answers?.[1] ?? ""}
질문3: 가장 재미있었던 순간은? -> ${answers?.[2] ?? ""}
질문4: 돌아올 때 마음은? -> ${answers?.[3] ?? ""}
요구사항: 문단 제목(발단/전개 등) 없이 연속 문단. 각 문단은 전각 공백(\\u3000) 들여쓰기.`;

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user }
        ]
      })
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(()=> "OpenAI upstream error");
      return new Response(text, { status: 500 });
    }

    // Pass-through but normalize each chunk to only the content delta
    const encoder = new TextEncoder();
    const reader = upstream.body.getReader();

    const stream = new ReadableStream({
      async pull(controller) {
        const { value, done } = await reader.read();
        if (done) { controller.close(); return; }
        const str = new TextDecoder().decode(value);
        // SSE lines: "data: {...}"
        for (const line of str.split("\\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const token = j.choices?.[0]?.delta?.content || "";
            if (token) {
              controller.enqueue(encoder.encode("data: " + JSON.stringify({ token }) + "\\n\\n"));
            }
          } catch {}
        }
      }
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (e) {
    return new Response("Server error: " + (e?.message || "unknown"), { status: 500 });
  }
}
