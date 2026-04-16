/**
 * Extracts AI-ready input from a user-uploaded resume file.
 *
 * Strategy (inspired by Firecrawl's PDF routing):
 *   1. PDF + extractable text → return text (cheap, fast).
 *   2. PDF with sparse/no text (image-based) → rasterize first page to PNG → return image.
 *   3. Image file (PNG/JPG) → return as image.
 *
 * Vision-AI handles cases 2 and 3 — costs more tokens but works on any layout.
 */

const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const PDF_TYPE = "application/pdf";

const TEXT_DENSITY_THRESHOLD = 100; // chars per page — below this we treat the PDF as image-based
const RASTER_SCALE = 2; // 2x for legibility on vision models

export type ResumeInput =
  | { kind: "text"; text: string }
  | { kind: "image"; mimeType: string; base64: string };

export function isSupportedResumeFile(file: File): boolean {
  return file.type === PDF_TYPE || SUPPORTED_IMAGE_TYPES.includes(file.type);
}

export async function extractResumeInput(file: File): Promise<ResumeInput> {
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return await fileToImageInput(file);
  }

  if (file.type === PDF_TYPE) {
    return await extractFromPdf(file);
  }

  throw new Error("Unsupported file type. Upload a PDF or image (PNG/JPG).");
}

async function fileToImageInput(file: File): Promise<ResumeInput> {
  const base64 = await fileToBase64(file);
  return { kind: "image", mimeType: file.type, base64 };
}

async function extractFromPdf(file: File): Promise<ResumeInput> {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let rawText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    rawText += pageText + "\n";
  }

  const trimmed = rawText.trim();
  const isTextDense = trimmed.length >= TEXT_DENSITY_THRESHOLD * pdf.numPages;

  if (isTextDense) {
    return { kind: "text", text: trimmed };
  }

  // Image-based PDF — rasterize first page and let vision-AI read it
  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: RASTER_SCALE });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create canvas context for PDF rasterization.");
  }

  await firstPage.render({ canvasContext: context, viewport, canvas }).promise;

  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.split(",")[1] ?? "";
  return { kind: "image", mimeType: "image/png", base64 };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
