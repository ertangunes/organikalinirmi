// BU KODU KOPYALAYIP TAMAMEN ESKİSİNİN YERİNE YAPIŞTIRIN

const GOOGLE_PROJECT_ID = "academic-emblem-478516-e7"; // 1. BURAYI DÜZELTTİĞİNDEN EMİN OL
const GOOGLE_LOCATION = "us-central1";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { product } = req.body || {};
    if (!product || !product.trim()) {
      return res.status(400).json({ error: "product is required" });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key bulunamadi!" });
    }

    const prompt = `
Kullanıcı bir gıda ürünü yazacak. Bu ürün organik mi yoksa normal mi alınmalı?
Kullanıcı hangi dilde sorarsa o dilde cevap ver.

Format:
1) Karar (ORGANİK AL / NORMAL YETER)
2) Risk skoru (1–10)
3) Gerekçe (2–3 cümle)

Ürün: ${product}
`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // YENİ Vertex AI API ADRESİ (Model: gemini-1.5-flash)
    // DİKKAT: Anahtar artık URL'nin sonunda (?key=...)
    const response = await fetch(
`https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/publishers/google/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization satırı buradan silindi
        },
        body: JSON.stringify(requestBody),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Vertex AI API error (Key in URL)",
        detail: text, 
      });
    }

    const data = JSON.parse(text);

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "YANIT ALINAMADI.";

    res.status(200).json({ result: answer });

  } catch (err) {
    res.status(500).json({
      error: "Sunucu hatasi (catch blogu)",
      detail: String(err),
    });
  }
}
