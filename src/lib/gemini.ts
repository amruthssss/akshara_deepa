import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { MOCK_QUESTIONS } from "../mockData";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
export const genAI = new GoogleGenerativeAI(API_KEY);

export const models = {
  flash: "gemini-1.5-flash",
  pro: "gemini-1.5-pro",
};

export async function generateQuiz(params: {
  subject: string;
  chapter: string;
  count: number;
  level: string;
  type?: 'MCQ' | 'SHORT' | 'LONG' | 'FILL' | 'BOARD_PATTERN';
  marks?: number;
  weakTopics?: string[];
  askedIds?: string[];
}) {
  const { subject, chapter, count, level, type = 'MCQ', marks, weakTopics = [], askedIds = [] } = params;
  
  if (!API_KEY) {
    console.error("Gemini API Key is missing. Falling back to mock data.");
    return MOCK_QUESTIONS.filter(q => q.subject === subject).slice(0, count);
  }

  const model = genAI.getGenerativeModel({
    model: models.flash,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            question: { type: SchemaType.STRING },
            type: { type: SchemaType.STRING },
            options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            correctAnswer: { type: SchemaType.NUMBER },
            fillAnswer: { type: SchemaType.STRING },
            explanation: { type: SchemaType.STRING },
            marks: { type: SchemaType.NUMBER },
            subject: { type: SchemaType.STRING },
            chapter: { type: SchemaType.STRING },
            difficulty: { type: SchemaType.STRING },
            conceptTag: { type: SchemaType.STRING },
            hint: { type: SchemaType.STRING },
            modelAnswer: { type: SchemaType.STRING },
            keyPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ["id", "question", "type", "explanation", "marks", "subject", "chapter", "difficulty", "conceptTag"]
        }
      }
    }
  });

  const prompt = `You are Akshara-Deepa, a premium AI academic companion for Class 10 Karnataka SSLC students.
Generate ${count} unique ${level} difficulty quiz questions for Chapter: "${chapter}" of Subject: "${subject}".
Align perfectly with Karnataka State Board SSLC 2025-26 syllabus and blueprint.

Question specifications:
- Focus on: ${type === 'BOARD_PATTERN' ? 'Mix of 1M, 2M, 3M, 4M, 5M' : type}
- Target Marks: ${marks || 'As per SSLC standards'}
- Weak topics to focus on: ${weakTopics.join(', ')}
- Do NOT repeat these IDs: ${askedIds.join(', ')}

Return ONLY valid JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return MOCK_QUESTIONS.filter(q => q.subject === subject).slice(0, count);
  }
}

export async function validateAnswer(params: {
  subject: string;
  chapter: string;
  question: string;
  marks: number;
  studentAnswer: string;
}) {
  const { subject, chapter, question, marks, studentAnswer } = params;

  if (!API_KEY) throw new Error("API Key missing");

  const model = genAI.getGenerativeModel({
    model: models.flash,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          score: { type: SchemaType.NUMBER },
          feedback: { type: SchemaType.STRING },
          improvementTip: { type: SchemaType.STRING }
        },
        required: ["score", "feedback"]
      }
    }
  });

  const prompt = `Evaluate this SSLC Class 10 answer based on Karnataka SSLC marking scheme.
Subject: ${subject} | Chapter: ${chapter}
Question: ${question} | Max marks: ${marks}
Student's answer: ${studentAnswer}

Provide score and encouraging feedback.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function generateStudyPlan(params: {
  name: string;
  school: string;
  days: number;
  hours: number;
  completedList: string[];
  weakList: string[];
  strongList: string[];
  subjectScores: any;
}) {
  if (!API_KEY) throw new Error("API Key missing");

  const model = genAI.getGenerativeModel({
    model: models.flash,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          planTitle: { type: SchemaType.STRING },
          strategy: { type: SchemaType.STRING },
          days: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                day: { type: SchemaType.NUMBER },
                theme: { type: SchemaType.STRING },
                morning: {
                  type: SchemaType.OBJECT,
                  properties: {
                    subject: { type: SchemaType.STRING },
                    chapter: { type: SchemaType.STRING }
                  }
                },
                afternoon: {
                  type: SchemaType.OBJECT,
                  properties: {
                    subject: { type: SchemaType.STRING },
                    chapter: { type: SchemaType.STRING }
                  }
                },
                evening: {
                  type: SchemaType.OBJECT,
                  properties: {
                    task: { type: SchemaType.STRING },
                    count: { type: SchemaType.NUMBER }
                  }
                },
                priority: { type: SchemaType.STRING },
                motivationTip: { type: SchemaType.STRING }
              }
            }
          }
        },
        required: ["planTitle", "strategy", "days"]
      }
    }
  });

  const prompt = `Create a high-intensity personalised SSLC study plan for ${params.name} from ${params.school}.
Days left: ${params.days}. Daily hours: ${params.hours}.
Completed: ${params.completedList.join(', ')}.
Weak: ${params.weakList.join(', ')}. Strong: ${params.strongList.join(', ')}.
Rules: RED days for weak topics. Last 7 days revision only.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
