export const runtime = "edge";

export async function POST(req) {
  try {
    const { topic, keywords = [] } = await req.json();
    const prompt = `감성적인 디지털 일러스트, 어린이 체험활동 표지, ${topic}.
배경 키워드: ${Array.isArray(keywords) ? keywords.join(", ") : ""}.
부드러운 색감, 따뜻한 조명, 보케, 텍스트 없음, 완전한 그림.`;

    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });
    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json || "";
    return new Response(JSON.stringify({ b64 }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
