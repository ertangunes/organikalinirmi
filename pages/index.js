import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!product.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

if (data.result) {
  setResult(data.result);
} else if (data.error || data.detail) {
  setResult(`Hata: ${data.error || ""}\n${data.detail || ""}`);
} else {
  setResult("Bir şeyler ters gitti.");
}

    } catch (err) {
      setResult("Sunucu hatası, lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#f5f5f5",
        padding: "16px",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "8px" }}>
        organikalinirmi.com
      </h1>
      <p style={{ marginBottom: "24px", color: "#555", textAlign: "center" }}>
        Ürünü yaz. Sana <b>organik mi normal mi</b> alman gerektiğini anlatsın.
        (Türkçe veya İngilizce yazabilirsin.)
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Örn: çilek, elma, muz, spinach, avocado..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#111827",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          {loading ? "Analiz ediliyor..." : "Sor"}
        </button>
      </form>

      <div
        style={{
          marginTop: "24px",
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          minHeight: "80px",
        }}
      >
        {result ? (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              margin: 0,
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          >
            {result}
          </pre>
        ) : (
          <span style={{ color: "#999", fontSize: "14px" }}>
            Sonuç burada görünecek.
          </span>
        )}
      </div>
    </div>
  );
}
