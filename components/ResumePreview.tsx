"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { ResumeData } from "@/lib/types";
import { dateRange, hasContent, splitSkills, toBullets, toHref } from "@/lib/utils";
import { FileIcon } from "./icons";

interface ResumePreviewProps {
  data: ResumeData;
  onMeasure?: (height: number) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="r-section">
      <h2 className="r-h2">{title}</h2>
      {children}
    </section>
  );
}

export function ResumePreview({ data, onMeasure }: ResumePreviewProps) {
  const pageRef = useRef<HTMLElement>(null);
  const { personal } = data;

  useEffect(() => {
    const element = pageRef.current;
    if (!element || !onMeasure) return;
    const report = () => onMeasure(element.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(element);
    return () => observer.disconnect();
  }, [onMeasure]);

  const contacts: { key: string; text: string; href?: string }[] = [];
  if (personal.email.trim())
    contacts.push({ key: "email", text: personal.email.trim(), href: `mailto:${personal.email.trim()}` });
  if (personal.phone.trim())
    contacts.push({ key: "phone", text: personal.phone.trim(), href: `tel:${personal.phone.replace(/[^\d+]/g, "")}` });
  if (personal.location.trim()) contacts.push({ key: "location", text: personal.location.trim() });
  if (personal.website.trim())
    contacts.push({ key: "website", text: personal.website.trim(), href: toHref(personal.website) });
  if (personal.linkedin.trim())
    contacts.push({ key: "linkedin", text: personal.linkedin.trim(), href: toHref(personal.linkedin) });

  const style = { "--accent": data.settings.accent } as CSSProperties;

  return (
    <article
      ref={pageRef}
      className="resume-page"
      data-template={data.settings.template}
      style={style}
      aria-label="Resume preview"
    >
      {!hasContent(data) ? (
        <div className="r-empty">
          <span className="r-emptyIcon">
            <FileIcon width={26} height={26} />
          </span>
          <h2>Your resume starts here</h2>
          <p>
            Fill in your details on the left. The page updates as you type and exports as a clean,
            print-ready PDF.
          </p>
        </div>
      ) : (
        <>
          <header className="r-header">
            <h1 className="r-name">{personal.fullName.trim() || "Your Name"}</h1>
            {personal.headline.trim() ? <p className="r-headline">{personal.headline}</p> : null}
            {contacts.length ? (
              <ul className="r-contact">
                {contacts.map((contact) => (
                  <li key={contact.key}>
                    {contact.href ? <a href={contact.href}>{contact.text}</a> : contact.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          {data.summary.trim() ? (
            <Section title="Professional Summary">
              <p className="r-summary">{data.summary.trim()}</p>
            </Section>
          ) : null}

          {data.experience.length ? (
            <Section title="Experience">
              {data.experience.map((item) => {
                const bullets = toBullets(item.description);
                const dates = dateRange(item.start, item.end);
                return (
                  <div className="r-item" key={item.id}>
                    <div className="r-itemHead">
                      <div className="r-itemTitle">
                        <h3 className="r-role">{item.role || "Role title"}</h3>
                        <p className="r-org">
                          {item.company ? <span className="r-company">{item.company}</span> : null}
                          {item.company && item.location ? <span className="r-sep">·</span> : null}
                          {item.location ? <span>{item.location}</span> : null}
                        </p>
                      </div>
                      {dates ? <p className="r-dates">{dates}</p> : null}
                    </div>
                    {bullets.length ? (
                      <ul className="r-bullets">
                        {bullets.map((bullet, index) => (
                          <li key={`${item.id}-${index}`}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </Section>
          ) : null}

          {data.projects.length ? (
            <Section title="Projects">
              {data.projects.map((project) => (
                <div className="r-project" key={project.id}>
                  <div className="r-projectHead">
                    <h3 className="r-role">{project.name || "Project name"}</h3>
                    {project.link.trim() ? (
                      <a className="r-projectLink" href={toHref(project.link)}>
                        {project.link.trim()}
                      </a>
                    ) : null}
                  </div>
                  {project.description.trim() ? (
                    <p className="r-projectText">{project.description.trim()}</p>
                  ) : null}
                </div>
              ))}
            </Section>
          ) : null}

          {data.education.length ? (
            <Section title="Education">
              {data.education.map((item) => {
                const dates = dateRange(item.start, item.end);
                return (
                  <div className="r-item" key={item.id}>
                    <div className="r-itemHead">
                      <div className="r-itemTitle">
                        <h3 className="r-role">{item.degree || "Degree"}</h3>
                        <p className="r-org">
                          {item.school ? <span className="r-company">{item.school}</span> : null}
                          {item.school && item.location ? <span className="r-sep">·</span> : null}
                          {item.location ? <span>{item.location}</span> : null}
                        </p>
                      </div>
                      {dates ? <p className="r-dates">{dates}</p> : null}
                    </div>
                    {item.details.trim() ? <p className="r-detail">{item.details.trim()}</p> : null}
                  </div>
                );
              })}
            </Section>
          ) : null}

          {data.skills.length ? (
            <Section title="Skills">
              <div className="r-skills">
                {data.skills.map((group) => {
                  const items = splitSkills(group.items);
                  if (!group.category.trim() && !items.length) return null;
                  return (
                    <div className="r-skillRow" key={group.id}>
                      {group.category.trim() ? (
                        <span className="r-skillCat">{group.category.trim()}</span>
                      ) : null}
                      <span className="r-skillList">{items.join("  ·  ")}</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {data.certifications.filter((item) => item.trim()).length ? (
            <Section title="Certifications">
              <ul className="r-bullets r-certs">
                {data.certifications
                  .filter((item) => item.trim())
                  .map((item, index) => (
                    <li key={`cert-${index}`}>{item.trim()}</li>
                  ))}
              </ul>
            </Section>
          ) : null}
        </>
      )}
    </article>
  );
}
