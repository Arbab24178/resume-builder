import {
  emptyResume,
  type Education,
  type Experience,
  type Project,
  type ResumeData,
  type SkillGroup,
} from "./types";

let counter = 0;

export function uid(prefix = "id"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

/** Split a textarea into bullets, tolerating leading dashes and blank lines. */
export function toBullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function dateRange(start: string, end: string): string {
  const from = start.trim();
  const to = end.trim();
  if (from && to) return `${from} — ${to}`;
  return from || to;
}

/** Ensure user-typed links are usable without forcing them to type a scheme. */
export function toHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function splitSkills(items: string): string[] {
  return items
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function hasContent(data: ResumeData): boolean {
  return Boolean(
    data.personal.fullName.trim() ||
      data.personal.email.trim() ||
      data.summary.trim() ||
      data.experience.length ||
      data.education.length ||
      data.skills.length,
  );
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Rehydrate persisted or imported JSON into a complete ResumeData object so a
 * partial or outdated payload can never crash the preview.
 */
export function reviveResume(raw: unknown): ResumeData {
  const base = emptyResume();
  if (!raw || typeof raw !== "object") return base;

  const data = raw as Record<string, unknown>;
  const personal = (data.personal ?? {}) as Record<string, unknown>;
  const settings = (data.settings ?? {}) as Record<string, unknown>;

  const objectList = <T,>(value: unknown, prefix: string, keys: string[]): T[] =>
    asArray(value).map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>;
      const out: Record<string, string> = { id: asString(item.id) || uid(prefix) };
      for (const key of keys) out[key] = asString(item[key]);
      return out as unknown as T;
    });

  return {
    personal: {
      fullName: asString(personal.fullName),
      headline: asString(personal.headline),
      email: asString(personal.email),
      phone: asString(personal.phone),
      location: asString(personal.location),
      website: asString(personal.website),
      linkedin: asString(personal.linkedin),
    },
    summary: asString(data.summary),
    experience: objectList<Experience>(data.experience, "exp", [
      "role",
      "company",
      "location",
      "start",
      "end",
      "description",
    ]),
    education: objectList<Education>(data.education, "edu", [
      "degree",
      "school",
      "location",
      "start",
      "end",
      "details",
    ]),
    projects: objectList<Project>(data.projects, "proj", ["name", "link", "description"]),
    skills: objectList<SkillGroup>(data.skills, "skill", ["category", "items"]),
    certifications: asArray(data.certifications).filter(
      (item): item is string => typeof item === "string",
    ),
    settings: {
      template: settings.template === "modern" ? "modern" : "classic",
      accent: asString(settings.accent) || base.settings.accent,
    },
  };
}
