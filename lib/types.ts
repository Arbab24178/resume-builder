export type TemplateId = "classic" | "modern";

export interface Personal {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  /** One achievement per line. Rendered as a bullet list. */
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  details: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  /** Comma separated list of skills. */
  items: string;
}

export interface Settings {
  template: TemplateId;
  accent: string;
}

export interface ResumeData {
  personal: Personal;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: string[];
  settings: Settings;
}

export const ACCENTS: { id: string; label: string; value: string }[] = [
  { id: "ink", label: "Ink", value: "#1f2937" },
  { id: "indigo", label: "Indigo", value: "#4338ca" },
  { id: "teal", label: "Teal", value: "#0f6b63" },
  { id: "wine", label: "Wine", value: "#8c2f39" },
  { id: "ochre", label: "Ochre", value: "#a15c12" },
];

export const emptyResume = (): ResumeData => ({
  personal: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  settings: { template: "classic", accent: "#1f2937" },
});
