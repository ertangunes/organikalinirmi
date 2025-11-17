
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { product } = req.body || {};
    if (!product || !product.trim()) {
      return res.status(400).json({ error: "product is required" });
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
// Vercel'i yeni anahtari kullanmaya zorla
const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
// ...
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Gemini API error",
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
      error: "Server error",
      detail: String(err),
    });
  }
}
