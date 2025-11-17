// BU KODU KOPYALAYIP TAMAMEN ESKİSİNİN YERİNE YAPIŞTIRIN
export default async function handler(req, res) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API Key bulunamadi!" });
    }

    // Google'a hangi modellerin olduğunu soruyoruz
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Google'dan model listesi alınamadı.",
        detail: text,
      });
    }

    // Listeyi bize göster
    const data = JSON.parse(text);
    res.status(200).json({ KULLANABILECEGIN_MODELLER: data });

  } catch (err) {
    res.status(500).json({
      error: "Sunucu hatasi",
      detail: String(err),
    });
  }
}
