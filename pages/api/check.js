export default async function handler(req, res) {
  try {
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
          "Kullanıcı bir gıda ürünü yazacak. Sen de ona bu ürünü organik mi yoksa normal mi almasının daha mantıklı olduğunu söyleyeceksin. Kullanıcı hangi dilde yazıyorsa o dilde cevap ver. Cevabın çok net ve kısa olsun ve şu formatta dön:\n\n1) Karar: (örnek: ORGANİK AL / NORMAL YETER)\n2) Risk skoru: 1–10 (10 = yüksek pestisit riski)\n3) Gerekçe: En fazla 2-3 cümle."
      },
      {
        role: "user",
        content: `Ürün: ${userInput}`,
      },
    ];

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        // Geniş erişimi olan bir model kullanıyoruz
        model: "gpt-4o-mini",
        messages,
        temperature: 0.4,
      }),
    });

    const text = await openaiResponse.text();

    if (!openaiResponse.ok) {
      console.error("OpenAI error:", text);
      return res.status(500).json({
        error: "OpenAI API error",
        detail: text,
      });
    }

    const data = JSON.parse(text);
    const answer =
      data.choices?.[0]?.message?.content ||
      "Şu anda cevap üretirken bir sorun oluştu.";

    return res.status(200).json({ result: answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
