
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DataSummary, Message, DataRow } from "../types";

export const generateAIResponse = async (
  prompt: string,
  summary: DataSummary,
  chatHistory: Message[],
  fullData: DataRow[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Kita sertakan data penuh dalam bentuk JSON yang diringkaskan untuk menjimatkan token
  // Memandangkan data ada ~129 baris, ia muat dalam konteks Gemini 3 Pro
  const fullDataJson = JSON.stringify(fullData);

  const systemInstruction = `
    Anda ialah Analytica, AI agent analisis data profesional. Anda mempunyai akses kepada KESEMUA data yang dimuat naik oleh pengguna.
    
    Berikut adalah butiran fail:
    - Nama Fail: ${summary.fileName}
    - Bilangan Baris: ${summary.rowCount}
    - Lajur: ${summary.columns.join(", ")}

    DATA PENUH (Format JSON):
    ${fullDataJson}

    Tugasan utama anda:
    1. Jawab soalan pengguna dengan merujuk terus kepada DATA PENUH di atas.
    2. Anda mesti membaca kesemua baris data untuk memberikan jawapan yang tepat (cth: mencari nilai tertinggi, mengira jumlah keseluruhan bagi kategori spesifik).
    3. Gunakan Bahasa Melayu yang ringkas, jelas dan profesional.
    4. Format jawapan menggunakan bullet point, jadual Markdown (jika sesuai), dan kesimpulan pendek.
    5. Jangan sesekali membuat data palsu. Jika maklumat tiada dalam dataset, nyatakan dengan jujur.
    
    Konteks: Pengguna mahu anda menganalisis setiap baris data yang diberikan untuk mencari cerapan mendalam.
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
        temperature: 0.2, // Rendahkan suhu untuk ketepatan fakta data yang lebih tinggi
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "Maaf, saya tidak dapat menjana jawapan buat masa ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, berlaku ralat semasa menghubungi ejen AI. Sila cuba sebentar lagi.";
  }
};
