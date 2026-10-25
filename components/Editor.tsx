"use client";

import type { ResumeData } from "@/lib/types";
import { uid } from "@/lib/utils";
import { AddButton, ItemCard, SectionCard, TextAreaField, TextField } from "./fields";
import { TrashIcon } from "./icons";

export type ListKey = "experience" | "education" | "projects" | "skills";

interface EditorProps {
  data: ResumeData;
  onPersonal: (field: keyof ResumeData["personal"], value: string) => void;
  onSummary: (value: string) => void;
  onList: <K extends ListKey>(key: K, items: ResumeData[K]) => void;
  onCertifications: (items: string[]) => void;
}

export function Editor({ data, onPersonal, onSummary, onList, onCertifications }: EditorProps) {
  const updateItem = <K extends ListKey>(
    key: K,
    index: number,
    patch: Record<string, string>,
  ) => {
    const list = data[key] as unknown as Record<string, string>[];
    const next = list.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onList(key, next as unknown as ResumeData[K]);
  };

  const moveItem = <K extends ListKey>(key: K, index: number, direction: -1 | 1) => {
    const list = [...(data[key] as unknown as Record<string, string>[])];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    onList(key, list as unknown as ResumeData[K]);
  };

  const removeItem = <K extends ListKey>(key: K, index: number) => {
    const list = (data[key] as unknown as Record<string, string>[]).filter((_, i) => i !== index);
    onList(key, list as unknown as ResumeData[K]);
  };

  const { personal } = data;

  return (
    <div className="editorStack">
      <SectionCard step={1} title="Personal details" description="How employers reach you.">
        <div className="grid2">
          <TextField
            label="Full name"
            value={personal.fullName}
            onChange={(value) => onPersonal("fullName", value)}
            placeholder="Amara Chen"
            autoComplete="name"
            wide
          />
          <TextField
            label="Professional headline"
            value={personal.headline}
            onChange={(value) => onPersonal("headline", value)}
            placeholder="Senior Product Designer"
            hint="Appears under your name."
            wide
          />
          <TextField
            label="Email"
            type="email"
            value={personal.email}
            onChange={(value) => onPersonal("email", value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <TextField
            label="Phone"
            type="tel"
            value={personal.phone}
            onChange={(value) => onPersonal("phone", value)}
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
          />
          <TextField
            label="Location"
            value={personal.location}
            onChange={(value) => onPersonal("location", value)}
            placeholder="City, Country"
          />
          <TextField
            label="Website"
            value={personal.website}
            onChange={(value) => onPersonal("website", value)}
            placeholder="yoursite.com"
          />
          <TextField
            label="LinkedIn"
            value={personal.linkedin}
            onChange={(value) => onPersonal("linkedin", value)}
            placeholder="linkedin.com/in/you"
            wide
          />
        </div>
      </SectionCard>

      <SectionCard
        step={2}
        title="Professional summary"
        description="Your pitch, in two or three sentences."
      >
        <TextAreaField
          label="Summary"
          value={data.summary}
          onChange={onSummary}
          rows={5}
          counter
          placeholder="Product designer with 8 years of experience building data-heavy B2B products..."
          hint="Lead with your role and years of experience, then your strongest proof point."
        />
      </SectionCard>

      <SectionCard
        step={3}
        title="Work experience"
        description="Most recent first. Focus on outcomes, not duties."
        action={
          <AddButton
            label="Add role"
            onClick={() =>
              onList("experience", [
                ...data.experience,
                {
                  id: uid("exp"),
                  role: "",
                  company: "",
                  location: "",
                  start: "",
                  end: "",
                  description: "",
                },
              ])
            }
          />
        }
      >
        {data.experience.length === 0 ? (
          <p className="emptyList">No roles yet. Add your current or most recent position.</p>
        ) : null}
        <div className="itemStack">
          {data.experience.map((item, index) => (
            <ItemCard
              key={item.id}
              index={index}
              total={data.experience.length}
              label={item.role || "Untitled role"}
              meta={item.company || undefined}
              onMove={(direction) => moveItem("experience", index, direction)}
              onRemove={() => removeItem("experience", index)}
              removeLabel="Remove this role"
            >
              <div className="grid2">
                <TextField
                  label="Job title"
                  value={item.role}
                  onChange={(value) => updateItem("experience", index, { role: value })}
                  placeholder="Senior Product Designer"
                />
                <TextField
                  label="Company"
                  value={item.company}
                  onChange={(value) => updateItem("experience", index, { company: value })}
                  placeholder="Northwind Analytics"
                />
                <TextField
                  label="Location"
                  value={item.location}
                  onChange={(value) => updateItem("experience", index, { location: value })}
                  placeholder="San Francisco, CA"
                />
                <div className="grid2 grid2Tight">
                  <TextField
                    label="Start"
                    value={item.start}
                    onChange={(value) => updateItem("experience", index, { start: value })}
                    placeholder="2021"
                  />
                  <TextField
                    label="End"
                    value={item.end}
                    onChange={(value) => updateItem("experience", index, { end: value })}
                    placeholder="Present"
                  />
                </div>
                <TextAreaField
                  label="Achievements"
                  value={item.description}
                  onChange={(value) => updateItem("experience", index, { description: value })}
                  rows={4}
                  placeholder={
                    "Led the redesign of the reporting suite, lifting weekly usage by 34%.\nBuilt a design system adopted by 4 product squads."
                  }
                  hint="One bullet per line. Start with a verb and include a number where you can."
                />
              </div>
            </ItemCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        step={4}
        title="Projects"
        description="Optional. Great for side work, open source or case studies."
        action={
          <AddButton
            label="Add project"
            onClick={() =>
              onList("projects", [
                ...data.projects,
                { id: uid("proj"), name: "", link: "", description: "" },
              ])
            }
          />
        }
      >
        {data.projects.length === 0 ? (
          <p className="emptyList">No projects yet. Add one to show applied work.</p>
        ) : null}
        <div className="itemStack">
          {data.projects.map((item, index) => (
            <ItemCard
              key={item.id}
              index={index}
              total={data.projects.length}
              label={item.name || "Untitled project"}
              onMove={(direction) => moveItem("projects", index, direction)}
              onRemove={() => removeItem("projects", index)}
              removeLabel="Remove this project"
            >
              <div className="grid2">
                <TextField
                  label="Project name"
                  value={item.name}
                  onChange={(value) => updateItem("projects", index, { name: value })}
                  placeholder="Signal — open-source chart kit"
                />
                <TextField
                  label="Link"
                  value={item.link}
                  onChange={(value) => updateItem("projects", index, { link: value })}
                  placeholder="github.com/you/project"
                />
                <TextAreaField
                  label="What it is"
                  value={item.description}
                  onChange={(value) => updateItem("projects", index, { description: value })}
                  rows={3}
                  placeholder="A React charting library used by six teams in production."
                />
              </div>
            </ItemCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        step={5}
        title="Education"
        description="Degree, school and anything worth noting."
        action={
          <AddButton
            label="Add education"
            onClick={() =>
              onList("education", [
                ...data.education,
                {
                  id: uid("edu"),
                  degree: "",
                  school: "",
                  location: "",
                  start: "",
                  end: "",
                  details: "",
                },
              ])
            }
          />
        }
      >
        {data.education.length === 0 ? (
          <p className="emptyList">No education added yet.</p>
        ) : null}
        <div className="itemStack">
          {data.education.map((item, index) => (
            <ItemCard
              key={item.id}
              index={index}
              total={data.education.length}
              label={item.degree || "Untitled degree"}
              meta={item.school || undefined}
              onMove={(direction) => moveItem("education", index, direction)}
              onRemove={() => removeItem("education", index)}
              removeLabel="Remove this entry"
            >
              <div className="grid2">
                <TextField
                  label="Degree"
                  value={item.degree}
                  onChange={(value) => updateItem("education", index, { degree: value })}
                  placeholder="B.F.A. Interaction Design"
                />
                <TextField
                  label="School"
                  value={item.school}
                  onChange={(value) => updateItem("education", index, { school: value })}
                  placeholder="California College of the Arts"
                />
                <TextField
                  label="Location"
                  value={item.location}
                  onChange={(value) => updateItem("education", index, { location: value })}
                  placeholder="San Francisco, CA"
                />
                <div className="grid2 grid2Tight">
                  <TextField
                    label="Start"
                    value={item.start}
                    onChange={(value) => updateItem("education", index, { start: value })}
                    placeholder="2012"
                  />
                  <TextField
                    label="End"
                    value={item.end}
                    onChange={(value) => updateItem("education", index, { end: value })}
                    placeholder="2016"
                  />
                </div>
                <TextAreaField
                  label="Highlights"
                  value={item.details}
                  onChange={(value) => updateItem("education", index, { details: value })}
                  rows={2}
                  placeholder="Graduated with honors. Thesis on clinical decision-making interfaces."
                />
              </div>
            </ItemCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        step={6}
        title="Skills"
        description="Group by theme so the list stays scannable."
        action={
          <AddButton
            label="Add group"
            onClick={() =>
              onList("skills", [...data.skills, { id: uid("skill"), category: "", items: "" }])
            }
          />
        }
      >
        {data.skills.length === 0 ? (
          <p className="emptyList">No skills yet. Try groups like Design, Research, Tools.</p>
        ) : null}
        <div className="itemStack">
          {data.skills.map((item, index) => (
            <ItemCard
              key={item.id}
              index={index}
              total={data.skills.length}
              label={item.category || "Skill group"}
              onMove={(direction) => moveItem("skills", index, direction)}
              onRemove={() => removeItem("skills", index)}
              removeLabel="Remove this skill group"
            >
              <div className="grid2">
                <TextField
                  label="Category"
                  value={item.category}
                  onChange={(value) => updateItem("skills", index, { category: value })}
                  placeholder="Design"
                />
                <TextField
                  label="Skills"
                  value={item.items}
                  onChange={(value) => updateItem("skills", index, { items: value })}
                  placeholder="Design systems, Prototyping, Accessibility"
                  hint="Separate with commas."
                />
              </div>
            </ItemCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        step={7}
        title="Certifications"
        description="Optional. Certificates, licenses or awards."
        action={
          <AddButton
            label="Add certification"
            onClick={() => onCertifications([...data.certifications, ""])}
          />
        }
      >
        {data.certifications.length === 0 ? (
          <p className="emptyList">No certifications added.</p>
        ) : null}
        <div className="certList">
          {data.certifications.map((cert, index) => (
            <div className="certRow" key={`cert-${index}`}>
              <input
                aria-label={`Certification ${index + 1}`}
                value={cert}
                placeholder="Nielsen Norman Group — UX Certification, 2022"
                onChange={(event) => {
                  const next = [...data.certifications];
                  next[index] = event.target.value;
                  onCertifications(next);
                }}
              />
              <button
                type="button"
                className="iconBtn iconBtnDanger"
                aria-label={`Remove certification ${index + 1}`}
                title="Remove certification"
                onClick={() => onCertifications(data.certifications.filter((_, i) => i !== index))}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
