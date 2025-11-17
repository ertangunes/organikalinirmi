// BU KODU KOPYALAYIP TAMAMEN ESKİSİNİN YERİNE YAPIŞTIRIN

// Bu ayarlar Google'ın Vertex AI için zorunlu kıldığı ayarlardır
const GOOGLE_PROJECT_ID = "sitemin-gemini-projesi"; // 1. BU SATIRI DEĞİŞTİR
const GOOGLE_LOCATION = "us-central1"; // Bu satıra DOKUNMA

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { product } = req.body || {};
    if (!product || !product.trim()) {
      return res.status(400).json({ error: "product is required" });
    }

    // Google API Anahtarını Vercel'den al
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key bulunamadi!" });
    }

    // Orijinal prompt'unuz
    const prompt = `
Kullanıcı bir gıda ürünü yazacak. Bu ürün organik mi yoksa normal mi alınmalı?
Kullanıcı hangi dilde sorarsa o dilde cevap ver.

Format:
1) Karar (ORGANİK AL / NORMAL YETER)
2) Risk skoru (1–10)
3) Gerekçe (2–3 cümle)

Ürün: ${product}
`;

    // Vertex AI için istek gövdesi (body) formatı farklıdır
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // YENİ Vertex AI API ADRESİ (Model: gemini-1.5-flash)
    // ÖNEMLİ: URL'de "googleProject" ve "googleLocation" var
    const response = await fetch(
`https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/publishers/google/models/gemini-1.5-flash-001:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`, // ESKİDEN: "x-goog-api-key" di, "Authorization" oldu
        },
        body: JSON.stringify(requestBody),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Vertex AI API error",
        detail: text, // Google'dan gelen asıl hata burada
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
