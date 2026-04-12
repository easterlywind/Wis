import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MediaType = "image" | "video" | "audio" | "unknown";

export async function detectMediaType(url: string): Promise<MediaType> {
  try {
    // Check by file extension first (fastest)
    const urlLower = url.toLowerCase();

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".mkv", ".m3u8"];
    const audioExtensions = [".mp3", ".wav", ".aac", ".flac", ".m4a", ".opus"];

    if (imageExtensions.some(ext => urlLower.includes(ext))) return "image";
    if (videoExtensions.some(ext => urlLower.includes(ext))) return "video";
    if (audioExtensions.some(ext => urlLower.includes(ext))) return "audio";

    // If no extension match, try to fetch headers
    const response = await fetch(url, { method: "HEAD", mode: "cors" });
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("image")) return "image";
    if (contentType.includes("video")) return "video";
    if (contentType.includes("audio")) return "audio";

    // Default to image if can't determine
    return "image";
  } catch {
    // Default to image if fetch fails
    return "image";
  }
}
