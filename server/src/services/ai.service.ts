import vision from '@google-cloud/vision';
import path from 'path';

const keyFilename = path.join(__dirname, '../../vision_key.json');
const client = new vision.ImageAnnotatorClient({ keyFilename });

export const extractTextFromImage = async (imagePath: string): Promise<string> => {
  try {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) return "";

    const fullText = detections[0].description || "";
    const cleanLines = fullText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 3);

    return [...new Set(cleanLines)].join('\n');
  } catch (error) {
    console.error("Google Vision API Hatası:", error);
    return "";
  }
};