import type { ResumeData } from "./types";
import { reviveResume } from "./utils";

const KEY = "resume-studio:v1";

export function loadResume(): ResumeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return reviveResume(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveResume(data: ResumeData): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredResume(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* storage may be unavailable in private mode */
  }
}
