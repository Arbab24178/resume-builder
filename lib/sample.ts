import type { ResumeData } from "./types";

export const sampleResume: ResumeData = {
  personal: {
    fullName: "Amara Chen",
    headline: "Senior Product Designer",
    email: "amara.chen@example.com",
    phone: "+1 (415) 555-0142",
    location: "San Francisco, CA",
    website: "amarachen.design",
    linkedin: "linkedin.com/in/amarachen",
  },
  summary:
    "Product designer with 8 years of experience shipping data-heavy B2B products from zero to scale. I pair research with rapid prototyping to turn ambiguous problems into interfaces teams can build. Known for raising design quality without slowing delivery.",
  experience: [
    {
      id: "exp-1",
      role: "Senior Product Designer",
      company: "Northwind Analytics",
      location: "San Francisco, CA",
      start: "2021",
      end: "Present",
      description:
        "Led the redesign of the reporting suite used by 40k+ analysts, lifting weekly active usage by 34%.\nBuilt and maintained a 60-component design system adopted by 4 product squads, cutting UI build time by 25%.\nRan a quarterly research program with 120+ customer interviews that reshaped the 2023 roadmap.\nMentored three mid-level designers and introduced a critique ritual now used company-wide.",
    },
    {
      id: "exp-2",
      role: "Product Designer",
      company: "Lumen Health",
      location: "Oakland, CA",
      start: "2018",
      end: "2021",
      description:
        "Designed patient onboarding that reduced drop-off by 41% across web and mobile.\nPartnered with clinical staff to simplify medication tracking for 18k daily users.\nShipped the first accessible design library, meeting WCAG 2.1 AA across core flows.",
    },
    {
      id: "exp-3",
      role: "UX Designer",
      company: "Fieldnote Studio",
      location: "Remote",
      start: "2016",
      end: "2018",
      description:
        "Delivered discovery and interface work for 12 early-stage clients in fintech and logistics.\nIntroduced usability testing as a standard deliverable, doubling repeat engagements.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.F.A. Interaction Design",
      school: "California College of the Arts",
      location: "San Francisco, CA",
      start: "2012",
      end: "2016",
      details: "Graduated with honors. Thesis on decision-making interfaces for clinical teams.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Signal — open-source chart kit",
      link: "github.com/amarachen/signal",
      description:
        "A React charting library for dense dashboards; 2.4k stars and used in production by six teams.",
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Design",
      items: "Interaction design, Information architecture, Design systems, Prototyping, Accessibility",
    },
    {
      id: "skill-2",
      category: "Research",
      items: "Usability testing, Interviews, Surveys, Jobs-to-be-done",
    },
    {
      id: "skill-3",
      category: "Tools",
      items: "Figma, FigJam, Framer, Maze, HTML/CSS, React",
    },
  ],
  certifications: [
    "Nielsen Norman Group — UX Certification, 2022",
    "IAAP — Certified Professional in Accessibility Core Competencies, 2021",
  ],
  settings: { template: "classic", accent: "#1f2937" },
};
