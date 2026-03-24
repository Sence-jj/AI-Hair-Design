import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Map hairstyle names to English prompts
const STYLE_PROMPTS: Record<string, string> = {
  "短发波波头": "bob haircut, short hair",
  "精灵短发": "pixie cut, very short hair",
  "中长波浪卷": "medium length wavy hair, beach waves",
  "长直发": "long straight hair, sleek",
  "长卷发": "long curly hair, voluminous curls",
  "高马尾": "high ponytail hairstyle",
  "丸子头": "bun hairstyle, hair bun on top",
  "编发": "braided hair, braids",
  "慵懒碎发": "shaggy layered hair, messy layers",
  "侧分长发": "side part long hair, straight",
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
    const { imageBase64, hairstyle, hairColor } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "缺少图片数据" }, { status: 400 });
    }

    const stylePrompt = STYLE_PROMPTS[hairstyle] || hairstyle;
    const colorPrompt = COLOR_PROMPTS[hairColor] || "natural hair color";

    // Use tencentarc/photomaker for portrait style transfer
    const output = await replicate.run(
      "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      {
        input: {
          prompt: `A portrait photo of a person with ${stylePrompt}, ${colorPrompt}, photorealistic, high quality, natural lighting img`,
          input_image: imageBase64,
          num_steps: 20,
          style_strength_ratio: 20,
          num_outputs: 1,
          guidance_scale: 5,
        },
      }
    );

    return NextResponse.json({ result: output });
  } catch (error: unknown) {
    console.error("Replicate error:", error);
    const message = error instanceof Error ? error.message : "AI 处理失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
