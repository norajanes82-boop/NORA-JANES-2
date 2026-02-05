
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DataSummary, Message, DataRow } from "./types";

export const generateAIResponse = async (
  prompt: string,
  summary: DataSummary,
  chatHistory: Message[],
  fullData: DataRow[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Menukarkan keseluruhan data kepada string JSON untuk dibaca oleh AI
  const fullDataJson = JSON.stringify(fullData);

  const systemInstruction = `
    Anda ialah Analytica, ejen AI analisis data profesional. Anda mempunyai akses kepada KESEMUA ${fullData.length} baris data yang dimuat naik.
    
    BUTIRAN DATA PENUH (JSON):
    ${fullDataJson}

    Tugasan utama anda:
    1. Baca KESEMUA baris data di atas sebelum menjawab.
    2. Berikan statistik tepat (cth: "Daerah Petaling mempunyai penduduk tertinggi iaitu 2,443,838").
    3. Analisis trend antara negeri atau daerah jika diminta.
    4. Gunakan Bahasa Melayu yang profesional dan mesra.
    5. Jika pengguna bertanya tentang "liputan", "kecukupan", atau "density", rujuk terus kepada kolum berkaitan dalam JSON.
    6. Gunakan jadual Markdown untuk perbandingan data yang banyak.
  `;

  try {
    const conversationHistory = chatHistory
      .filter((m, index) => !(index === 0 && m.role === 'model'))
      .map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Suhu rendah untuk ketepatan data yang maksimum
      }
    });

    return response.text || "Maaf, saya tidak dapat memproses data tersebut.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, berlaku ralat teknikal. Sila cuba lagi.";
  }
};
