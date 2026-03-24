import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
  "短发波波头": "bob haircut, short hair, chin length",
  "精灵短发": "pixie cut, very short hair",
  "中长波浪卷": "medium length wavy hair, beach waves",
  "长直发": "long straight hair, sleek and smooth",
  "长卷发": "long curly hair, voluminous curls",
  "高马尾": "high ponytail hairstyle",
  "丸子头": "top bun hairstyle, hair bun",
  "编发": "braided hair, braids",
  "慵懒碎发": "shaggy layered hair, messy layers",
  "侧分长发": "side part long straight hair",
};

const COLOR_PROMPTS: Record<string, string> = {
  "#1a1a1a": "natural black hair",
  "#2c1810": "dark brown hair",
  "#8B4513": "chestnut brown hair",
  "#C68642": "golden brown hair",
  "#D4A853": "blonde hair",
  "#722F37": "burgundy red hair",
  "#9B4F6A": "rose brown hair",
  "#C0C0C0": "silver gray hair",
};

export async function POST(req: NextRequest) {
  try {
    const { hairstyle, hairColor } = await req.json();

    const stylePrompt = STYLE_PROMPTS[hairstyle] || hairstyle;
    const colorPrompt = COLOR_PROMPTS[hairColor] || "natural hair color";

    const prompt = `professional portrait photo of a beautiful person with ${stylePrompt}, ${colorPrompt}, photorealistic, high quality, natural studio lighting, sharp focus, 8k`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("HF error:", err);
      throw new Error(`生成失败: ${response.status}`);
    }

    // Response is binary image — convert to base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({ result: dataUrl });
  } catch (error: unknown) {
    console.error("API error:", error);
    const message = error instanceof Error ? error.message : "AI 生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
