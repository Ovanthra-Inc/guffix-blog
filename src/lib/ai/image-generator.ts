import { storage } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils/slugify";

/**
 * Generates an image using OpenAI DALL-E 3 and uploads it to Firebase Storage.
 * @param prompt The descriptive prompt for image generation
 * @param fileNameBase The base name for the file (e.g. blog slug)
 * @returns The public URL of the uploaded image
 */
export async function generateAndUploadImage(
  prompt: string,
  fileNameBase: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[Image Generator] OPENAI_API_KEY is not set. Skipping image generation.");
    return "";
  }

  try {
    console.log(`[Image Generator] Generating image for: ${fileNameBase}`);
    
    // 1. Call OpenAI DALL-E 3
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const b64Data = data.data[0].b64_json;
    const buffer = Buffer.from(b64Data, "base64");

    // 2. Upload to Firebase Storage
    const bucket = storage.bucket();
    const fileName = `blog-images/${slugify(fileNameBase)}-${Date.now()}.png`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: {
        contentType: "image/png",
      },
    });

    // 3. Make public and get URL
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    console.log(`[Image Generator] Successfully uploaded image: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error("[Image Generator] Failed to generate or upload image:", error);
    return "";
  }
}
