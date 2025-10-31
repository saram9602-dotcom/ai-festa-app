import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ 사용 우선순위: 최신 > 일반 > 8B > Pro
const MODEL_CANDIDATES = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
];

function makePrompt({ heroName, experience, emotion, whenWhere, inciting, conflict, resolution }) {
  const nameLine = heroName ? `- 주인공 이름: ${heroName}\n` : `- 주인공 이름: (입력 없으면 어울리는 이름을 1개 정해 사용)\n`;
  return `너는 초등학생 눈높이의 감동적 단편 소설 기획자야. 아래 정보를 바탕으로
[제목], [줄거리(발단-전개-위기-절정-결말)], [핵심 메시지]를 한국어로 500~700자 내외로 작성해줘.
${nameLine}- 인상 깊었던 경험: ${experience}
- 감정: ${emotion}
- 시간/장소: ${whenWhere}
- 발단: ${inciting}
- 가장 큰 문제: ${conflict}
- 해결: ${resolution}
작성 규칙: 1) 초등학생도 이해하기 쉽게, 2) 따뜻하고 긍정적 톤, 3) 문단 나눔은 2~3개. 주인공 이름은 본문에 자연스럽게 등장시켜라.`;
}

// ✅ 모델을 순차 시도해 404면 자동 폴백
async function generateStory(payload) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing in Vercel Environment Variables.');

  let lastErr;
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(makePrompt(payload));
      const text = (await result.response.text())?.trim();
      if (text) return text;
      lastErr = new Error(`Empty response from ${modelName}`);
    } catch (e) {
      // 404 또는 메서드 미지원 시 다음 후보로
      lastErr = e;
      if (String(e)?.includes('404') || String(e)?.includes('not supported')) continue;
      // 그 외 에러는 즉시 throw
      throw e;
    }
  }
  throw lastErr || new Error('No model produced a response');
}

async function sendMail({ to, subject, text }) {
  if (!MAIL_USER || !MAIL_PASS) throw new Error('MAIL_USER/MAIL_PASS missing');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
  const info = await transporter.sendMail({
    from: `AI 소설 체험 <${MAIL_USER}>`,
    to,
    subject,
    text,
  });
  return info?.messageId ?? true;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // 개발 편의를 위해 에러를 그대로 보여줌
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in Vercel Environment Variables.' });
    }

    const { mode, email, story, ...fields } = req.body || {};

    if (mode === 'generate') {
      const output = await generateStory(fields);
      return res.json({ ok: true, story: output });
    }

    if (mode === 'send') {
      if (!email) return res.status(400).json({ error: 'Email is required' });
      const text = story || (await generateStory(fields));
      await sendMail({ to: email, subject: 'AI 소설 체험 — 나의 소설 줄거리', text });
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Invalid mode' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
