import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

async function generateStory(payload) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API Key missing');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = makePrompt(payload);
  const result = await model.generateContent(prompt);
  const text = (await result.response.text())?.trim();
  return text;
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
