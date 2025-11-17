// BU KODU KOPYALAYIP TAMAMEN ESKİSİNİN YERİNE YAPIŞTIRIN
export default async function handler(req, res) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      // Hata olsa bile 200 gönder (hile)
      return res.status(200).json({ 
        HATA_BU: "API Key bulunamadi!",
        HATA_DETAYI: "Vercel'de GOOGLE_API_KEY bulunamiyor." 
      });
    }

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
      // Hata olsa bile 200 gönder (hile)
      return res.status(200).json({
        HATA_BU: "Google'dan model listesi alınamadı.",
        HATA_DETAYI: text, // Google'dan gelen asıl hata burada
      });
    }

    const data = JSON.parse(text);
    res.status(200).json({ KULLANABILECEGIN_MODELLER: data });

  } catch (err) {
    // Hata olsa bile 200 gönder (hile)
    res.status(200).json({
      HATA_BU: "Sunucu hatasi (catch blogu)",
      HATA_DETAYI: String(err),
    });
  }
}
