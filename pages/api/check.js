// api/check.js
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4.1-nano", // en ucuz model
      input: "check"
    });

    const text =
      response.output?.[0]?.content?.[0]?.text ||
      "ok";

    res.status(200).json({ ok: true, model: "gpt-4.1-nano", reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
