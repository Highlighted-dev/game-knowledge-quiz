import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  // Parse topic upfront so we have it for fallback
  let topic = 'Unknown';
  try {
    const body = await req.json();
    topic = body.topic || 'Unknown';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!topic || topic === 'Unknown') {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  // If no API key, return mock data
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set, returning mock data');
    return NextResponse.json(generateMockCategory(topic));
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Wygeneruj kategorię quizu o "${topic}" w stylu Jeopardy.

Zwróć TYLKO poprawny JSON w tym formacie (bez markdown, bez bloków kodu):
{
  "id": "cat_${Date.now()}",
  "name": "${topic}",
  "questions": [
    {
      "id": "q_100",
      "points": 100,
      "type": "OPEN",
      "question": "Łatwe pytanie tutaj?",
      "answer": "Krótka odpowiedź",
      "isAnswered": false
    },
    {
      "id": "q_200",
      "points": 200,
      "type": "ABCD",
      "question": "Pytanie wielokrotnego wyboru?",
      "options": ["Opcja A", "Opcja B", "Opcja C", "Opcja D"],
      "answer": "Opcja A",
      "isAnswered": false
    },
    {
      "id": "q_300",
      "points": 300,
      "type": "OPEN",
      "question": "Średniej trudności pytanie?",
      "answer": "Odpowiedź tutaj",
      "isAnswered": false
    },
    {
      "id": "q_400",
      "points": 400,
      "type": "OPEN",
      "question": "Trudne pytanie?",
      "answer": "Odpowiedź tutaj",
      "isAnswered": false
    },
    {
      "id": "q_500",
      "points": 500,
      "type": "OPEN",
      "question": "Pytanie na poziomie eksperta?",
      "answer": "Odpowiedź tutaj",
      "isAnswered": false
    }
  ]
}

Wymagania:
- 5 pytań (100, 200, 300, 400, 500 punktów)
- Trudność powinna rosnąć wraz z punktami
- Pytania powinny być ciekawe i specyficzne dla tematu
- Przynajmniej jedno pytanie typu ABCD
- Odpowiedzi powinny być zwięzłe (1-5 słów)
- WSZYSTKO PO POLSKU`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up the response (remove markdown if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const category = JSON.parse(cleanedText);
    
    // Ensure proper formatting
    category.id = `cat_${Date.now()}`;
    category.questions = category.questions.map((q: any, idx: number) => ({
      ...q,
      id: `q_${Date.now()}_${(idx + 1) * 100}`,
      isAnswered: false,
    }));

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('AI Generation Error:', error?.message || error);
    // Fallback to mock data on any error
    return NextResponse.json(generateMockCategory(topic));
  }
}

function generateMockCategory(topic: string) {
  const ts = Date.now();
  return {
    id: `cat_${ts}`,
    name: topic,
    questions: [
      { id: `q_${ts}_100`, points: 100, type: 'OPEN', question: `Z czego najbardziej znany jest ${topic}?`, answer: 'Przykładowa odpowiedź', isAnswered: false },
      { id: `q_${ts}_200`, points: 200, type: 'ABCD', question: `Co jest związane z ${topic}?`, options: ['Opcja A', 'Opcja B', 'Opcja C', 'Opcja D'], answer: 'Opcja A', isAnswered: false },
      { id: `q_${ts}_300`, points: 300, type: 'OPEN', question: `Podaj ciekawostkę o ${topic}?`, answer: 'Przykładowa odpowiedź', isAnswered: false },
      { id: `q_${ts}_400`, points: 400, type: 'OPEN', question: `Trudne pytanie o ${topic}?`, answer: 'Przykładowa odpowiedź', isAnswered: false },
      { id: `q_${ts}_500`, points: 500, type: 'OPEN', question: `Ekspertowe pytanie o ${topic}?`, answer: 'Przykładowa odpowiedź', isAnswered: false },
    ]
  };
}
