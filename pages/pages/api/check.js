export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { product } = req.body || {};

  if (!product || !product.trim()) {
    return res.status(400).json({ error: "product is required" });
  }

  const userInput = product.trim();

  const messages = [
    {
      role: "system",
      content:
        "Kullanıcı bir gıda ürünü yazacak. Sen de ona bu ürünü organik mi yoksa normal mi almasının daha mantıklı olduğunu söyleyeceksin. Kullanıcı hangi dilde yazıyorsa o dilde cevap ver. Cevabın çok net ve kısa olsun ve şu formatta dön:\n\n1) Karar: (örnek: ORGANİK AL / NORMAL YETER)\n2) Risk skoru: 1–10 arası bir sayı (10 = yüksek pestisit riski)\n3) Gerekçe: En fazla 2-3 cümle. İnce/kalın kabuk, pestisit riski, EWG Dirty Dozen / Clean Fifteen mantığı gibi kriterleri kullan."
    },
    {
      role: "user",
      content: `Ürün: ${userInput}`,
    },
  ];

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.4,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI error:", errorText);
      return res
        .status(500)
        .json({ error: "OpenAI API error", detail: errorText });
    }

    const data = await openaiResponse.json();
    const answer =
      data.choices?.[0]?.message?.content ||
      "Şu anda cevap üretirken bir sorun oluştu.";

    return res.status(200).json({ result: answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
